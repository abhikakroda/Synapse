// Supabase Configuration
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth functions
async function signUp(phone, name, college) {
  const { data, error } = await supabase.auth.signUp({
    phone,
    password: phone,
    options: { data: { name, college } }
  });
  if (error) throw error;
  await supabase.from("users").upsert({ phone, name, college });
  localStorage.setItem("synapse_user", JSON.stringify({ phone, name, college }));
  return data;
}

async function signIn(phone) {
  const { data, error } = await supabase.auth.signInWithPassword({
    phone,
    password: phone
  });
  if (error) throw error;
  const user = data.user;
  const profile = { phone, name: user.user_metadata?.name || "" };
  localStorage.setItem("synapse_user", JSON.stringify(profile));
  return profile;
}

async function signOut() {
  await supabase.auth.signOut();
  localStorage.removeItem("synapse_user");
  localStorage.removeItem("synapse_purchases");
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
