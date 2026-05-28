const RESOURCE_PURCHASE_KEY = "openzara_resource_purchases";

const defaultResources = [
  {
    slug: "python-basics-pdf",
    title: "Python Basics PDF",
    description: "Syntax, loops, functions, lists, dictionaries and beginner practice questions.",
    price: 99,
    active: true,
    cover_image: "",
    page_images: []
  },
  {
    slug: "ai-ml-roadmap-pdf",
    title: "AI & ML Roadmap PDF",
    description: "Machine learning flow, tools, project ideas and interview preparation notes.",
    price: 149,
    active: true,
    cover_image: "",
    page_images: []
  }
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readPurchasedResources() {
  try {
    return JSON.parse(localStorage.getItem(RESOURCE_PURCHASE_KEY) || "[]");
  } catch {
    return [];
  }
}

function savePurchasedResource(resource, paymentId) {
  const rows = readPurchasedResources().filter((item) => item.slug !== resource.slug);
  rows.push({
    slug: resource.slug,
    title: resource.title,
    paymentId,
    purchasedAt: new Date().toISOString()
  });
  localStorage.setItem(RESOURCE_PURCHASE_KEY, JSON.stringify(rows));
}

function hasResourceAccess(resource) {
  const price = Number(resource.price || 0);
  return price <= 0 || readPurchasedResources().some((item) => item.slug === resource.slug);
}

function mergeResources(remoteRows) {
  const map = new Map(defaultResources.map((item) => [item.slug, item]));
  (remoteRows || []).forEach((item) => {
    if (!item?.slug || item.deleted || item.active === false) return;
    map.set(item.slug, { ...map.get(item.slug), ...item });
  });
  return Array.from(map.values()).filter((item) => item.active !== false && !item.deleted);
}

async function loadResources() {
  const client = typeof getSupabaseClient === "function" ? getSupabaseClient() : null;
  if (!client) return defaultResources;

  try {
    const { data, error } = await client.from("admin_resources").select("*").eq("active", true);
    if (error) return defaultResources;
    return mergeResources(data || []);
  } catch {
    return defaultResources;
  }
}

function resourceArt(resource) {
  if (resource.cover_image) {
    return `<img src="${escapeHtml(resource.cover_image)}" alt="${escapeHtml(resource.title)} cover" loading="lazy" draggable="false" />`;
  }
  return `<div class="resource-art ai-art">${escapeHtml(resource.title.slice(0, 2).toUpperCase())}</div>`;
}

function renderResourceCard(resource) {
  const purchased = hasResourceAccess(resource);
  const price = Number(resource.price || 0);
  const disabled = !Array.isArray(resource.page_images) || resource.page_images.length === 0;
  const action = purchased
    ? `<a class="btn btn-primary" href="resource-viewer.html?resource=${encodeURIComponent(resource.slug)}">View PDF</a>`
    : `<button class="btn btn-primary" type="button" data-buy-resource="${escapeHtml(resource.slug)}" ${disabled ? "disabled" : ""}>Buy ₹${price.toLocaleString("en-IN")}</button>`;

  return `
    <article class="resource-shop-card">
      <figure>${resourceArt(resource)}</figure>
      <div>
        <h2>${escapeHtml(resource.title)}</h2>
        <p>${escapeHtml(resource.description || "")}</p>
        <div class="resource-shop-meta">
          <span>${resource.page_count || resource.page_images?.length || 0} pages</span>
          <strong>${price <= 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`}</strong>
        </div>
        <div class="resource-card-actions">
          ${action}
          ${disabled ? "<small>Upload PDF pages from admin first.</small>" : "<small>View-only image reader</small>"}
        </div>
      </div>
    </article>
  `;
}

async function buyResource(resource) {
  if (hasResourceAccess(resource)) {
    window.location.href = `resource-viewer.html?resource=${encodeURIComponent(resource.slug)}`;
    return;
  }

  if (!window.Clerk) {
    alert("Login service loading. Please try again.");
    return;
  }

  try {
    await window.Clerk.load();
  } catch {}

  if (!window.Clerk.user) {
    if (typeof openClerkSignIn === "function") openClerkSignIn();
    else window.Clerk.openSignIn();
    return;
  }

  const amount = Number(resource.price || 0);
  if (amount <= 0) {
    savePurchasedResource(resource, "FREE-RESOURCE");
    window.location.href = `resource-viewer.html?resource=${encodeURIComponent(resource.slug)}`;
    return;
  }

  if (!window.Razorpay) {
    alert("Payment service loading. Please try again.");
    return;
  }

  const userDetails = typeof getClerkUserDetails === "function" ? getClerkUserDetails() : {};
  const options = {
    key: "rzp_test_SrFYeqYJM1Ef3u",
    amount: amount * 100,
    currency: "INR",
    name: "Openzara Academy",
    description: resource.title,
    prefill: {
      name: userDetails.name || "",
      email: userDetails.email || "",
      contact: userDetails.phone || ""
    },
    handler: async (response) => {
      savePurchasedResource(resource, response.razorpay_payment_id);
      if (typeof savePurchase === "function") {
        await savePurchase({
          ...userDetails,
          course: `Resource: ${resource.title}`,
          paymentId: response.razorpay_payment_id,
          amount
        });
      }
      window.location.href = `resource-viewer.html?resource=${encodeURIComponent(resource.slug)}`;
    },
    theme: { color: "#343aa4" }
  };
  new Razorpay(options).open();
}

async function initResourceShop() {
  const grid = document.getElementById("resourceShopGrid");
  if (!grid) return;

  const resources = await loadResources();
  grid.innerHTML = resources.length
    ? resources.map(renderResourceCard).join("")
    : `<p class="empty-state">No resources available.</p>`;

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-buy-resource]");
    if (!button) return;
    const resource = resources.find((item) => item.slug === button.dataset.buyResource);
    if (resource) buyResource(resource);
  });
}

function blockViewerShortcuts() {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("copy", (event) => event.preventDefault());
  document.addEventListener("cut", (event) => event.preventDefault());
  document.addEventListener("selectstart", (event) => {
    if (event.target.closest(".secure-pages")) event.preventDefault();
  });
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if ((event.ctrlKey || event.metaKey) && ["p", "s", "u", "c", "a"].includes(key)) {
      event.preventDefault();
    }
  });
}

async function initResourceViewer() {
  const pagesRoot = document.getElementById("securePages");
  if (!pagesRoot) return;

  blockViewerShortcuts();
  const slug = new URLSearchParams(window.location.search).get("resource");
  const resources = await loadResources();
  const resource = resources.find((item) => item.slug === slug);

  if (!resource) {
    pagesRoot.innerHTML = `<p class="empty-state">Resource not found.</p>`;
    return;
  }

  if (!hasResourceAccess(resource)) {
    window.location.href = "resources.html";
    return;
  }

  document.title = `${resource.title} | Openzara Academy`;
  const title = document.getElementById("viewerTitle");
  if (title) title.textContent = resource.title;

  const pages = Array.isArray(resource.page_images) ? resource.page_images : [];
  pagesRoot.innerHTML = pages.length
    ? pages.map((src, index) => `
      <figure class="secure-page">
        <img src="${escapeHtml(src)}" alt="Page ${index + 1}" draggable="false" />
        <figcaption>Page ${index + 1}</figcaption>
      </figure>
    `).join("")
    : `<p class="empty-state">No preview pages are uploaded yet.</p>`;
}

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

initResourceShop();
initResourceViewer();
