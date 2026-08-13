const RESOURCE_PURCHASE_KEY = "openzara_resource_purchases";
const OFFICIAL_SITE_ORIGIN = "https://www.openzara.online";
const RESOURCE_LIST_COLUMNS = "slug,title,description,price,active,deleted,cover_image,page_count,updated_at";
const defaultResourceCoupons = {
  "OPENZARA100": { discount: 100, type: "flat", target: "all" },
  "STAY10": { discount: 10, type: "percent", target: "all" }
};
let resourceCoupons = { ...defaultResourceCoupons };
const resourceCheckoutState = new Map();

const defaultResources = [
  {
    slug: "python-basics-pdf",
    title: "Python Basics PDF",
    description: "Syntax, loops, functions, lists, dictionaries and beginner practice questions.",
    price: 99,
    active: true,
    cover_image: "",
    format: "PDF study guide",
    page_count: "Beginner notes",
    topics: ["Python syntax", "Loops & functions", "Practice questions"],
    page_images: []
  },
  {
    slug: "ai-ml-roadmap-pdf",
    title: "AI & ML Roadmap PDF",
    description: "Machine learning flow, tools, project ideas and interview preparation notes.",
    price: 149,
    active: true,
    cover_image: "",
    format: "PDF roadmap",
    page_count: "Career guide",
    topics: ["Learning path", "Project ideas", "Interview prep"],
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

const normalizeCouponCode = (value) => String(value || "").trim().toUpperCase();
const normalizeSlug = (value) => String(value || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, "");

function officialUrl(path) {
  return new URL(path, OFFICIAL_SITE_ORIGIN).href;
}

function getResourceShareUrl(resource) {
  return officialUrl(`resources.html?resource=${encodeURIComponent(resource.slug)}`);
}

function formatInr(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function readPurchasedResources() {
  try {
    return JSON.parse(localStorage.getItem(RESOURCE_PURCHASE_KEY) || "[]");
  } catch {
    return [];
  }
}

function savePurchasedResource(resource, paymentId, amount = Number(resource.price || 0), couponCode = "") {
  const rows = readPurchasedResources().filter((item) => item.slug !== resource.slug);
  rows.push({
    slug: resource.slug,
    title: resource.title,
    paymentId,
    amount,
    couponCode,
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

async function loadResources({ includePages = false, slug = "" } = {}) {
  const client = typeof getSupabaseClient === "function" ? getSupabaseClient() : null;
  if (!client) return defaultResources;

  try {
    let query = client
      .from("admin_resources")
      .select(includePages ? "*" : RESOURCE_LIST_COLUMNS)
      .eq("active", true)
      .eq("deleted", false);
    if (slug) query = query.eq("slug", slug);

    const { data, error } = await query;
    if (error) return defaultResources;
    return mergeResources(data || []);
  } catch {
    return defaultResources;
  }
}

async function loadResourceCoupons() {
  const client = typeof getSupabaseClient === "function" ? getSupabaseClient() : null;
  if (!client) return { ...defaultResourceCoupons };

  try {
    const { data, error } = await client.from("admin_coupons").select("*").eq("active", true);
    if (error) return { ...defaultResourceCoupons };

    const activeCoupons = { ...defaultResourceCoupons };
    (data || []).forEach((row) => {
      const code = normalizeCouponCode(row.code);
      const target = normalizeSlug(row.course_slug || "all");
      const expiresAt = row.expires_at ? new Date(row.expires_at).getTime() : 0;
      const usageLimit = Number(row.usage_limit || 0);
      const usedCount = Number(row.used_count || 0);

      if (!code || row.deleted || row.active === false || (expiresAt && expiresAt < Date.now())) return;
      if (usageLimit > 0 && usedCount >= usageLimit) return;

      activeCoupons[code] = {
        discount: Number(row.discount || 0),
        type: row.type === "percent" ? "percent" : "flat",
        target: target || "all"
      };
    });

    return activeCoupons;
  } catch {
    return { ...defaultResourceCoupons };
  }
}

function couponAppliesToResource(coupon, resource) {
  const target = normalizeSlug(coupon?.target || "all");
  const slug = normalizeSlug(resource.slug);
  return ["all", "resource", "resources", "pdf", "pdfs"].includes(target) || target === slug;
}

function getDiscountedResourcePrice(resource, coupon) {
  const basePrice = Number(resource.price || 0);
  if (!coupon || !couponAppliesToResource(coupon, resource)) return basePrice;

  const discount = Number(coupon.discount || 0);
  const discounted = coupon.type === "percent"
    ? Math.round(basePrice - (basePrice * discount / 100))
    : basePrice - discount;

  return Math.max(0, discounted);
}

function resourceArt(resource) {
  if (resource.cover_image) {
    return `<img src="${escapeHtml(resource.cover_image)}" alt="${escapeHtml(resource.title)} cover" loading="lazy" draggable="false" />`;
  }
  const initials = escapeHtml(resource.title.slice(0, 2).toUpperCase());
  return `
    <div class="resource-art resource-cover-placeholder">
      <span class="resource-cover-brand">Openzara Notes</span>
      <strong>${initials}</strong>
      <small>${escapeHtml(resource.title)}</small>
    </div>
  `;
}

function renderResourceCard(resource) {
  const purchased = hasResourceAccess(resource);
  const price = Number(resource.price || 0);
  const disabled = Number(resource.page_count || 0) <= 0;
  const slug = escapeHtml(resource.slug);
  const topics = Array.isArray(resource.topics)
    ? resource.topics
    : String(resource.topics || "").split("\n").map((item) => item.trim()).filter(Boolean);
  const action = purchased
    ? `<a class="btn btn-primary" href="resource-viewer.html?resource=${encodeURIComponent(resource.slug)}">View PDF</a>`
    : `<button class="btn btn-primary" type="button" data-buy-resource="${slug}" ${disabled ? "disabled" : ""}>Buy ${formatInr(price)}</button>`;

  return `
    <article class="resource-shop-card" id="resource-${slug}" data-resource-card="${slug}">
      <figure>${resourceArt(resource)}</figure>
      <div>
        <span class="resource-type">${escapeHtml(resource.format || "PDF resource")}</span>
        <h2>${escapeHtml(resource.title)}</h2>
        <p>${escapeHtml(resource.description || "")}</p>
        <div class="resource-topic-list">
          ${topics.slice(0, 4).map((topic) => `<span>${escapeHtml(topic)}</span>`).join("")}
        </div>
        <div class="resource-detail-row">
          <span>${escapeHtml(resource.page_count || "Online notes")}</span>
          <span>Secure online viewing</span>
        </div>
        <div class="resource-shop-meta">
          <strong data-resource-price="${slug}">${price <= 0 ? "Free" : formatInr(price)}</strong>
          ${purchased ? "<small>Purchased</small>" : disabled ? "<small>Coming soon</small>" : ""}
        </div>
        ${!purchased && !disabled ? `
        <div class="resource-coupon-row">
          <input type="text" data-resource-coupon-input="${slug}" placeholder="Coupon code" aria-label="Coupon code for ${escapeHtml(resource.title)}" />
          <button class="btn btn-secondary" type="button" data-apply-resource-coupon="${slug}">Apply</button>
        </div>
        <p class="resource-coupon-status" data-resource-coupon-status="${slug}" aria-live="polite"></p>` : ""}
        <div class="resource-card-actions">
          ${action}
          <button class="btn btn-secondary resource-share-btn" type="button" data-share-resource="${slug}">Share</button>
        </div>
      </div>
    </article>
  `;
}

async function shareResource(resource, button) {
  const url = getResourceShareUrl(resource);
  const title = `${resource.title} | Openzara Resources`;
  const text = resource.description || "Openzara learning resource";

  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    if (button) {
      const original = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = original || "Share";
      }, 1600);
    }
  } catch (error) {
    if (button) button.textContent = "Try again";
  }
}

function applyResourceCoupon(resource, card) {
  const input = card.querySelector(`[data-resource-coupon-input="${CSS.escape(resource.slug)}"]`);
  const status = card.querySelector(`[data-resource-coupon-status="${CSS.escape(resource.slug)}"]`);
  const buyButton = card.querySelector(`[data-buy-resource="${CSS.escape(resource.slug)}"]`);
  const priceLabel = card.querySelector(`[data-resource-price="${CSS.escape(resource.slug)}"]`);
  const code = normalizeCouponCode(input?.value);
  const coupon = resourceCoupons[code];
  const basePrice = Number(resource.price || 0);

  if (!code || !coupon || !couponAppliesToResource(coupon, resource)) {
    resourceCheckoutState.set(resource.slug, { price: basePrice, couponCode: "" });
    if (status) {
      status.textContent = "Invalid coupon code";
      status.style.color = "#d32f2f";
    }
    if (buyButton) buyButton.textContent = `Buy ${formatInr(basePrice)}`;
    if (priceLabel) priceLabel.textContent = basePrice <= 0 ? "Free" : formatInr(basePrice);
    return;
  }

  const finalPrice = getDiscountedResourcePrice(resource, coupon);
  const savings = basePrice - finalPrice;
  resourceCheckoutState.set(resource.slug, { price: finalPrice, couponCode: code });

  if (status) {
    status.textContent = savings > 0 ? `Coupon applied. You save ${formatInr(savings)}.` : "Coupon applied.";
    status.style.color = "#155f3c";
  }
  if (buyButton) buyButton.textContent = finalPrice === 0 ? "Get Free" : `Pay ${formatInr(finalPrice)}`;
  if (priceLabel) priceLabel.textContent = finalPrice === 0 ? "Free" : formatInr(finalPrice);
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

  const checkoutState = resourceCheckoutState.get(resource.slug) || {};
  const amount = Number(checkoutState.price ?? resource.price ?? 0);
  const appliedCouponCode = normalizeCouponCode(checkoutState.couponCode);
  const userDetails = typeof getClerkUserDetails === "function" ? getClerkUserDetails() : {};

  if (amount <= 0) {
    savePurchasedResource(resource, appliedCouponCode ? "FREE-COUPON" : "FREE-RESOURCE", 0, appliedCouponCode);
    if (typeof savePurchase === "function") {
      await savePurchase({
        ...userDetails,
        course: `Resource: ${resource.title}`,
        paymentId: appliedCouponCode ? "FREE-COUPON" : "FREE-RESOURCE",
        amount: 0
      });
    }
    await recordResourceCouponUsage(appliedCouponCode);
    window.location.href = `resource-viewer.html?resource=${encodeURIComponent(resource.slug)}`;
    return;
  }

  if (!window.Razorpay) {
    alert("Payment service loading. Please try again.");
    return;
  }

  const options = {
    key: "rzp_test_SrFYeqYJM1Ef3u",
    amount: Math.round(amount * 100),
    currency: "INR",
    name: "Openzara",
    description: resource.title,
    prefill: {
      name: userDetails.name || "",
      email: userDetails.email || "",
      contact: userDetails.phone || ""
    },
    handler: async (response) => {
      savePurchasedResource(resource, response.razorpay_payment_id, amount, appliedCouponCode);
      if (typeof savePurchase === "function") {
        await savePurchase({
          ...userDetails,
          course: `Resource: ${resource.title}`,
          paymentId: response.razorpay_payment_id,
          amount
        });
      }
      await recordResourceCouponUsage(appliedCouponCode);
      window.location.href = `resource-viewer.html?resource=${encodeURIComponent(resource.slug)}`;
    },
    theme: { color: "#343aa4" }
  };
  new Razorpay(options).open();
}

async function recordResourceCouponUsage(code) {
  const couponCode = normalizeCouponCode(code);
  if (!couponCode) return;

  try {
    const client = typeof getSupabaseClient === "function" ? getSupabaseClient() : null;
    if (!client?.rpc) return;
    await client.rpc("redeem_admin_coupon", { coupon_code: couponCode });
  } catch (error) {
    console.warn("Resource coupon usage could not be recorded", error);
  }
}

async function initResourceShop() {
  const grid = document.getElementById("resourceShopGrid");
  if (!grid) return;

  const [resources, coupons] = await Promise.all([loadResources(), loadResourceCoupons()]);
  resourceCoupons = coupons;
  resources.forEach((resource) => {
    resourceCheckoutState.set(resource.slug, { price: Number(resource.price || 0), couponCode: "" });
  });

  grid.innerHTML = resources.length
    ? resources.map(renderResourceCard).join("")
    : `<p class="empty-state">No resources available.</p>`;

  grid.addEventListener("click", (event) => {
    const couponButton = event.target.closest("[data-apply-resource-coupon]");
    if (couponButton) {
      const resource = resources.find((item) => item.slug === couponButton.dataset.applyResourceCoupon);
      const card = couponButton.closest(".resource-shop-card");
      if (resource && card) applyResourceCoupon(resource, card);
      return;
    }

    const shareButton = event.target.closest("[data-share-resource]");
    if (shareButton) {
      const resource = resources.find((item) => item.slug === shareButton.dataset.shareResource);
      if (resource) shareResource(resource, shareButton);
      return;
    }

    const button = event.target.closest("[data-buy-resource]");
    if (!button) return;
    const resource = resources.find((item) => item.slug === button.dataset.buyResource);
    if (resource) buyResource(resource);
  });

  grid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const input = event.target.closest("[data-resource-coupon-input]");
    if (!input) return;
    event.preventDefault();
    const resource = resources.find((item) => item.slug === input.dataset.resourceCouponInput);
    const card = input.closest(".resource-shop-card");
    if (resource && card) applyResourceCoupon(resource, card);
  });

  const focusedResourceSlug = normalizeSlug(new URLSearchParams(window.location.search).get("resource"));
  if (focusedResourceSlug) {
    const focusedCard = grid.querySelector(`[data-resource-card="${CSS.escape(focusedResourceSlug)}"]`);
    if (focusedCard) {
      focusedCard.classList.add("is-shared-target");
      focusedCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
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
  const resources = await loadResources({ includePages: true, slug });
  const resource = resources.find((item) => item.slug === slug);

  if (!resource) {
    pagesRoot.innerHTML = `<p class="empty-state">Resource not found.</p>`;
    return;
  }

  if (!hasResourceAccess(resource)) {
    window.location.href = "resources.html";
    return;
  }

  document.title = `${resource.title} | Openzara`;
  const title = document.getElementById("viewerTitle");
  if (title) title.textContent = resource.title;
  const shareButton = document.getElementById("viewerShareBtn");
  if (shareButton) {
    shareButton.addEventListener("click", () => shareResource(resource, shareButton));
  }

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
