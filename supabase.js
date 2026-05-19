// Supabase Configuration
var SYNAPSE_SUPABASE_URL = "https://mvvcwechakssylptnfey.supabase.co";
var SYNAPSE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12dmN3ZWNoYWtzc3lscHRuZmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDAzMDIsImV4cCI6MjA5NDc3NjMwMn0.lsEyFPrf5WaKAbxiSU5A5KpzzsOsy5HvQA8wQzwsZwg";
var synapseSupabaseClient = null;

function getSupabaseClient() {
  if (!synapseSupabaseClient && window.supabase?.createClient) {
    synapseSupabaseClient = window.supabase.createClient(
      SYNAPSE_SUPABASE_URL,
      SYNAPSE_SUPABASE_ANON_KEY
    );
  }

  return synapseSupabaseClient;
}

function getClerkRedirectUrl(path = "dashboard.html") {
  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    return new URL(path, window.location.href).href;
  }

  return `http://127.0.0.1:4173/${path}`;
}

function openClerkSignIn() {
  window.Clerk.openSignIn({
    fallbackRedirectUrl: getClerkRedirectUrl(),
    forceRedirectUrl: getClerkRedirectUrl()
  });
}

function getClerkUserDetails(user = window.Clerk?.user) {
  if (!user) return {};

  const email = user.primaryEmailAddress?.emailAddress || "";
  const phone = user.primaryPhoneNumber?.phoneNumber || "";
  const name = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" ") || email || phone || "Student";

  return {
    clerkId: user.id || "",
    email,
    phone,
    name
  };
}

async function saveUserProfile(details) {
  const client = getSupabaseClient();
  if (!client) return null;

  const richProfile = {
    clerk_id: details.clerkId,
    email: details.email,
    phone: details.phone || details.email,
    name: details.name,
    college: details.college || "",
    updated_at: new Date().toISOString()
  };

  const { error } = await client.from("users").upsert(richProfile, {
    onConflict: details.clerkId ? "clerk_id" : "phone"
  });

  if (!error) return null;

  return client.from("users").upsert({
    phone: details.phone || details.email,
    name: details.name,
    college: details.college || ""
  });
}

async function updateClerkEnrollment(details) {
  const user = window.Clerk?.user;
  if (!user?.update) return null;

  const existingSynapse = user.unsafeMetadata?.synapse || {};
  const purchases = Array.isArray(existingSynapse.purchases) ? existingSynapse.purchases : [];

  return user.update({
    unsafeMetadata: {
      ...user.unsafeMetadata,
      synapse: {
        ...existingSynapse,
        enrolled: true,
        latestCourse: details.course,
        latestPaymentId: details.paymentId,
        latestAmount: details.amount,
        purchases: [
          ...purchases,
          {
            course: details.course,
            paymentId: details.paymentId,
            amount: details.amount,
            purchasedAt: details.purchasedAt
          }
        ]
      }
    }
  });
}

async function saveEnrollment(details) {
  const purchasedAt = new Date().toISOString();
  const userDetails = getClerkUserDetails();
  const enrollment = {
    ...userDetails,
    ...details,
    purchasedAt
  };

  const purchases = JSON.parse(localStorage.getItem("synapse_purchases") || "[]");
  purchases.push({
    title: enrollment.course,
    date: new Date(purchasedAt).toLocaleDateString("en-IN"),
    paymentId: enrollment.paymentId,
    amount: enrollment.amount
  });
  localStorage.setItem("synapse_purchases", JSON.stringify(purchases));
  localStorage.setItem("synapse_user", JSON.stringify({
    clerkId: enrollment.clerkId,
    email: enrollment.email,
    phone: enrollment.phone || enrollment.email,
    name: enrollment.name
  }));

  const results = await Promise.allSettled([
    saveUserProfile(enrollment),
    savePurchase(enrollment),
    updateClerkEnrollment(enrollment)
  ]);

  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length) {
    console.warn("Some enrollment details were not saved", failed);
  }

  return enrollment;
}

// Auth functions (Clerk)
function initClerkAuth() {
  const authBtn = document.getElementById("navAuth");
  if (!authBtn) return;

  authBtn.onclick = async () => {
    if (!window.Clerk) {
      // Wait up to 5s for Clerk
      await new Promise(r => {
        const i = setInterval(() => { if (window.Clerk) { clearInterval(i); r(); } }, 200);
        setTimeout(() => { clearInterval(i); r(); }, 5000);
      });
    }
    if (!window.Clerk) { alert("Login service loading, please try again."); return; }
    await window.Clerk.load();
    if (window.Clerk.user) {
      window.location.href = "dashboard.html";
    } else {
      openClerkSignIn();
    }
  };

  // Auto-update if already signed in
  const poll = setInterval(async () => {
    if (!window.Clerk) return;
    clearInterval(poll);
    await window.Clerk.load();
    if (window.Clerk.user) authBtn.textContent = "My Batch";
  }, 1000);
}

async function signUp(phone, name, college) {
  await saveUserProfile({ phone, name, college });
  localStorage.setItem("synapse_user", JSON.stringify({ phone, name, college }));
}

async function signOut() {
  if (window.Clerk) await window.Clerk.signOut();
  localStorage.removeItem("synapse_user");
  localStorage.removeItem("synapse_purchases");
}

document.addEventListener("DOMContentLoaded", initClerkAuth);

// Leads
async function saveLead(data) {
  return getSupabaseClient()?.from("leads").insert({
    name: data.name,
    phone: data.phone,
    program: data.program,
    college: data.college || "",
    message: data.message || "",
    created_at: new Date().toISOString()
  });
}

// Purchases
async function savePurchase(detailsOrPhone, course, paymentId, amount) {
  const client = getSupabaseClient();
  if (!client) return null;

  const details = typeof detailsOrPhone === "object"
    ? detailsOrPhone
    : { phone: detailsOrPhone, course, paymentId, amount };

  const richPurchase = {
    clerk_id: details.clerkId,
    email: details.email,
    phone: details.phone || details.email,
    name: details.name,
    course: details.course,
    payment_id: details.paymentId,
    amount: details.amount,
    status: "paid",
    created_at: details.purchasedAt || new Date().toISOString()
  };

  const { error } = await client.from("purchases").insert(richPurchase);
  if (!error) return null;

  return client.from("purchases").insert({
    phone: details.phone || details.email,
    course: details.course,
    payment_id: details.paymentId,
    amount: details.amount,
    created_at: richPurchase.created_at
  });
}

async function getPurchases(phone) {
  const { data } = await getSupabaseClient()?.from("purchases").select("*").eq("phone", phone) || {};
  return data || [];
}

// Certificate verification
async function verifyCertificate(certId) {
  const { data } = await getSupabaseClient()?.from("certificates").select("*").eq("cert_id", certId).single() || {};
  return data;
}
