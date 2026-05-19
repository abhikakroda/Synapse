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
  await getSupabaseClient()?.from("users").upsert({ phone, name, college });
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
async function savePurchase(phone, course, paymentId, amount) {
  return getSupabaseClient()?.from("purchases").insert({
    phone,
    course,
    payment_id: paymentId,
    amount,
    created_at: new Date().toISOString()
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
