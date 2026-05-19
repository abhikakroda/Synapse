// Supabase Configuration
const SUPABASE_URL = "https://mvvcwechakssylptnfey.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12dmN3ZWNoYWtzc3lscHRuZmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDAzMDIsImV4cCI6MjA5NDc3NjMwMn0.lsEyFPrf5WaKAbxiSU5A5KpzzsOsy5HvQA8wQzwsZwg";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth functions (Clerk)
let clerkLoaded = false;

function initClerkAuth() {
  const authBtn = document.getElementById("navAuth");
  if (!authBtn) return;

  if (window.Clerk) {
    window.Clerk.load().then(() => {
      clerkLoaded = true;
      updateAuthButton(authBtn);
      window.Clerk.addListener(({ user }) => updateAuthButton(authBtn));
    });
  }
}

function updateAuthButton(btn) {
  const user = window.Clerk?.user;
  if (user) {
    btn.textContent = "My Batch";
    btn.href = "dashboard.html";
    btn.onclick = null;
  } else {
    btn.textContent = "Login";
    btn.href = "#";
    btn.onclick = (e) => { e.preventDefault(); window.Clerk.openSignIn(); };
  }
}

async function signUp(phone, name, college) {
  await supabase.from("users").upsert({ phone, name, college });
  localStorage.setItem("synapse_user", JSON.stringify({ phone, name, college }));
}

async function signOut() {
  if (window.Clerk) await window.Clerk.signOut();
  localStorage.removeItem("synapse_user");
  localStorage.removeItem("synapse_purchases");
}

// Init Clerk on load
if (typeof window !== "undefined") {
  window.addEventListener("load", initClerkAuth);
}

// Leads
async function saveLead(data) {
  return supabase.from("leads").insert({
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
  return supabase.from("purchases").insert({
    phone,
    course,
    payment_id: paymentId,
    amount,
    created_at: new Date().toISOString()
  });
}

async function getPurchases(phone) {
  const { data } = await supabase.from("purchases").select("*").eq("phone", phone);
  return data || [];
}

// Certificate verification
async function verifyCertificate(certId) {
  const { data } = await supabase.from("certificates").select("*").eq("cert_id", certId).single();
  return data;
}
