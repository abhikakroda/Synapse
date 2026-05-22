let courseCatalog = {
  "ai-ml": {
    title: "AI & ML",
    eyebrow: "Complete course",
    poster: "assets/course-posters/ai-ml.png",
    mentor: "Udhay",
    role: "AI & ML Instructor",
    summary:
      "A 45-day structured internship covering Python programming, data analysis, machine learning algorithms, deep learning, generative AI, and end-to-end project building. Students go from zero coding experience to deploying ML models and building AI-powered tools for their portfolio.",
    status: "Live from 20 June 2026",
    cta: "Apply Now",
    price: "₹999",
    oldPrice: "₹4,999",
    discount: "80% OFF",
    bundle: "Early bird sale price",
    duration: "45 Days",
    mode: "Online (Live + Recorded)",
    batchSize: "Limited to 60 students",
    certificate: "Internship completion certificate with project title",
    highlights: [
      "Python from scratch",
      "NumPy & Pandas",
      "Data visualization",
      "Machine learning",
      "Deep learning basics",
      "Generative AI & LLMs",
      "Real-world projects",
      "Resume & interview prep"
    ],
    syllabus: [
      "Week 1: Python foundations — variables, loops, functions, OOP, file handling, and debugging",
      "Week 2: Data toolkit — NumPy arrays, Pandas DataFrames, data cleaning, and Matplotlib/Seaborn visualization",
      "Week 3: Machine learning core — train/test split, linear regression, logistic regression, decision trees, random forests, and model evaluation metrics",
      "Week 4: Advanced ML & deep learning — SVMs, clustering (K-Means), dimensionality reduction (PCA), intro to neural networks with TensorFlow/Keras",
      "Week 5: Generative AI — prompt engineering, OpenAI API, LangChain basics, building chatbots, and AI-powered automation tools",
      "Week 6: Capstone project — end-to-end ML pipeline, model deployment basics, project documentation, resume integration, and mock interview preparation"
    ],
    projects: [
      "Student performance predictor using regression",
      "AI-powered resume analyzer with NLP",
      "Chatbot built with LLM and LangChain workflow",
      "Data dashboard with interactive visualizations",
      "Image classifier using deep learning"
    ],
    whoIsItFor: [
      "College students (1st to final year) from any branch",
      "Beginners with zero coding experience",
      "Students preparing for tech placements",
      "Anyone wanting to add AI/ML projects to their resume"
    ],
    outcomes: [
      "Build 3–5 portfolio-ready AI/ML projects",
      "Understand end-to-end ML pipeline from data to deployment",
      "Get internship completion certificate with project title",
      "Resume and LinkedIn profile optimized for AI/ML roles",
      "Mock interview preparation for data science positions"
    ]
  },
  cybersecurity: {
    title: "Cybersecurity",
    eyebrow: "Complete course",
    poster: "assets/course-posters/cybersecurity.png",
    mentor: "Sahil Khan",
    role: "Cybersecurity Expert",
    summary:
      "Go from security basics to practical ethical hacking, network defense, Kali Linux tools, bug hunting and career roadmap.",
    status: "Coming Soon",
    cta: "Show Interest",
    price: "Coming Soon",
    bundle: "Enrollment will open after the AI & ML launch.",
    highlights: ["Ethical hacking basics", "Network security", "Kali Linux", "Bug hunting"],
    syllabus: [
      "Cybersecurity fundamentals, threat types and safe lab setup",
      "Linux commands, Kali Linux workflow and security tool basics",
      "Networking essentials, scanning, ports, DNS and traffic analysis",
      "Web security basics including OWASP Top 10 and common flaws",
      "Vulnerability reporting, bug bounty workflow and responsible disclosure",
      "Security project, certificate review and cybersecurity career roadmap"
    ],
    projects: ["Network scan report", "OWASP demo lab", "Security checklist for a web app"]
  }
};

const params = new URLSearchParams(window.location.search);
const courseKey = params.get("course");
const root = document.querySelector("#courseRoot");
let adminCourseRefreshTimer = null;
let checkoutCoupons = {
  "STAY10": { discount: 10, type: "percent" },
  "SYNAPSE100": { discount: 100, type: "flat" },
  "EARLY50": { discount: 50, type: "flat" },
  "REFER100": { discount: 100, type: "flat" },
  "MANSOOR": { discount: 100, type: "percent" }
};

const parseListValue = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return String(value).split("\n").map((item) => item.trim()).filter(Boolean);
};

const readLocalRows = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const mergeAdminRows = (localRows, remoteRows, idKey) => {
  const map = new Map();
  [...localRows, ...remoteRows].forEach((row) => {
    const id = row?.[idKey];
    if (!id) return;
    if (row.deleted) {
      map.delete(id);
      return;
    }
    map.set(id, row);
  });
  return Array.from(map.values());
};

const applyCourseOverrides = (rows) => {
  rows.forEach((row) => {
    const slug = row.slug;
    if (!slug) return;

    courseCatalog[slug] = {
      ...(courseCatalog[slug] || {}),
      title: row.title || courseCatalog[slug]?.title || slug,
      eyebrow: courseCatalog[slug]?.eyebrow || "Complete course",
      poster: row.poster || courseCatalog[slug]?.poster || "assets/synopse-concept.png",
      mentor: row.mentor || courseCatalog[slug]?.mentor || "Synapse Team",
      role: row.role || courseCatalog[slug]?.role || "Mentor",
      summary: row.summary || courseCatalog[slug]?.summary || "",
      status: row.status || courseCatalog[slug]?.status || "Coming Soon",
      cta: row.cta || courseCatalog[slug]?.cta || "Apply Now",
      price: row.price || courseCatalog[slug]?.price || "Coming Soon",
      oldPrice: row.old_price || courseCatalog[slug]?.oldPrice || "",
      discount: row.discount || courseCatalog[slug]?.discount || "",
      bundle: row.bundle || courseCatalog[slug]?.bundle || "",
      duration: row.duration || courseCatalog[slug]?.duration || "",
      mode: courseCatalog[slug]?.mode || "Online",
      batchSize: courseCatalog[slug]?.batchSize || "",
      certificate: courseCatalog[slug]?.certificate || "",
      highlights: parseListValue(row.highlights).length ? parseListValue(row.highlights) : courseCatalog[slug]?.highlights || [],
      syllabus: parseListValue(row.syllabus).length ? parseListValue(row.syllabus) : courseCatalog[slug]?.syllabus || [],
      projects: parseListValue(row.projects).length ? parseListValue(row.projects) : courseCatalog[slug]?.projects || [],
      whoIsItFor: courseCatalog[slug]?.whoIsItFor,
      outcomes: courseCatalog[slug]?.outcomes
    };
  });
};

const applyCouponOverrides = (rows) => {
  const activeCoupons = {};
  rows.forEach((row) => {
    const expiresAt = row.expires_at ? new Date(row.expires_at).getTime() : 0;
    const usageLimit = Number(row.usage_limit || 0);
    const usedCount = Number(row.used_count || 0);
    if (!row.code || row.deleted || row.active === false || (expiresAt && expiresAt < Date.now())) return;
    if (usageLimit > 0 && usedCount >= usageLimit) return;
    if (row.course_slug && row.course_slug !== "ai-ml") return;
    activeCoupons[String(row.code).toUpperCase()] = {
      discount: Number(row.discount || 0),
      type: row.type === "percent" ? "percent" : "flat"
    };
  });

  if (Object.keys(activeCoupons).length) {
    checkoutCoupons = activeCoupons;
  }
};

async function loadAdminCourseConfig() {
  const client = typeof getSupabaseClient === "function" ? getSupabaseClient() : null;
  const localCourses = readLocalRows("synapse_admin_courses");
  const localCoupons = readLocalRows("synapse_admin_coupons");

  try {
    if (!client) {
      applyCourseOverrides(localCourses);
      applyCouponOverrides(localCoupons);
      return;
    }

    const [{ data: courseRows }, { data: couponRows }] = await Promise.all([
      client.from("admin_courses").select("*"),
      client.from("admin_coupons").select("*").eq("active", true)
    ]);
    applyCourseOverrides(mergeAdminRows(localCourses, courseRows || [], "slug"));
    applyCouponOverrides(mergeAdminRows(localCoupons, couponRows || [], "code"));
  } catch (error) {
    console.warn("Admin course config unavailable", error);
    applyCourseOverrides(localCourses);
    applyCouponOverrides(localCoupons);
  }
}

function refreshAdminCourseConfig() {
  if (adminCourseRefreshTimer) {
    clearTimeout(adminCourseRefreshTimer);
  }

  adminCourseRefreshTimer = setTimeout(async () => {
    await loadAdminCourseConfig();
    renderCoursePage();
  }, 120);
}

function watchAdminCourseConfig() {
  const client = typeof getSupabaseClient === "function" ? getSupabaseClient() : null;

  window.addEventListener("storage", (event) => {
    if (event.key === "synapse_admin_courses" || event.key === "synapse_admin_coupons") {
      refreshAdminCourseConfig();
    }
  });

  if (!client?.channel) return;

  client
    .channel("synapse-course-config")
    .on("postgres_changes", { event: "*", schema: "public", table: "admin_courses" }, refreshAdminCourseConfig)
    .on("postgres_changes", { event: "*", schema: "public", table: "admin_coupons" }, refreshAdminCourseConfig)
    .subscribe();
}

const setMetaContent = (selector, content) => {
  const meta = document.querySelector(selector);
  meta?.setAttribute("content", content);
};

const ensureJsonLd = (schema) => {
  let script = document.querySelector("#courseStructuredData");

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "courseStructuredData";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schema);
};

const updateCourseSeo = (course, key) => {
  if (window.location.protocol === "file:") {
    return;
  }

  const origin = window.location.origin;
  const pageUrl = new URL(window.location.pathname, origin);
  const imageUrl = new URL(course?.poster || "assets/synopse-concept.png", origin).href;
  const canonical = document.querySelector('link[rel="canonical"]');
  const title = course
    ? `${course.title} Course Syllabus & Internship Projects | Synapse`
    : "Synapse Courses, Pricing & Internship Syllabus";
  const description = course
    ? `${course.summary} See syllabus, projects, mentor details, pricing, certificate support, and batch status.`
    : "Compare Synapse AI & ML and cybersecurity internship courses with syllabus, mentor details, projects, pricing, and batch status.";

  if (key) {
    pageUrl.searchParams.set("course", key);
  }

  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  canonical?.setAttribute("href", pageUrl.href);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', pageUrl.href);
  setMetaContent('meta[property="og:image"]', imageUrl);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);
  setMetaContent('meta[name="twitter:image"]', imageUrl);

  if (course) {
    ensureJsonLd({
      "@context": "https://schema.org",
      "@type": "Course",
      name: `${course.title} Course`,
      description,
      provider: {
        "@type": "Organization",
        name: "Synapse",
        url: origin
      },
      image: imageUrl,
      url: pageUrl.href,
      offers: course.oldPrice
        ? {
            "@type": "Offer",
            price: "999",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: pageUrl.href
          }
        : {
            "@type": "Offer",
            availability: "https://schema.org/PreOrder",
            url: pageUrl.href
          },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        instructor: {
          "@type": "Person",
          name: course.mentor
        }
      }
    });
    return;
  }

  ensureJsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Synapse courses",
    url: pageUrl.href,
    itemListElement: Object.entries(courseCatalog).map(([courseSlug, item], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${item.title} Course`,
      url: new URL(`course.html?course=${courseSlug}`, origin).href
    }))
  });
};

const renderPrice = (item) => {
  if (!item.oldPrice) {
    return `
      <strong>${item.price}</strong>
      <span>${item.bundle}</span>
    `;
  }

  return `
    <div class="sale-price-stack">
      <span class="old-price">${item.oldPrice}</span>
      <strong>${item.price}</strong>
    </div>
    <span class="discount-badge">${item.discount}</span>
    <span>${item.bundle}</span>
  `;
};

const renderCourseCard = ([key, item]) => `
  <article class="all-course-card" id="${key}">
    <figure class="all-course-media">
      <img src="${item.poster}" alt="${item.title} course poster" />
    </figure>
    <div class="all-course-body">
      <p class="section-label">${item.eyebrow}</p>
      <h2>${item.title}</h2>
      <span class="course-status-badge ${key === "ai-ml" ? "is-live" : ""}">${item.status}</span>
      <p>${item.summary}</p>
      <div class="course-price-row">
        ${renderPrice(item)}
      </div>
      <div class="course-meta-row">
        <span>Mentor: ${item.mentor}</span>
        <span>${item.role}</span>
      </div>
      <div class="course-card-highlights">
        ${item.highlights.map((point) => `<span>${point}</span>`).join("")}
      </div>
      <a class="btn btn-primary see-more-btn" href="course.html?course=${key}">See More</a>
    </div>
  </article>
`;

function renderCoursePage() {
if (!root) return;

if (!courseKey) {
  document.title = "All Courses & Pricing | Synapse";
  updateCourseSeo();

  root.innerHTML = `
    <section class="all-courses-hero section-pad">
      <p class="section-label">Course</p>
      <h1>All courses. See more for full details.</h1>
      <p>
        Choose a Synapse course, compare syllabus, pricing, mentor details,
        and open the full course page before enrolling.
      </p>
      <div class="course-summary-pricing">
        ${Object.values(courseCatalog).slice(0, 3).map((item) => `
          <article class="sale-summary-card">
            <span>${item.title}</span>
            <div>
              ${item.oldPrice ? `<del>${item.oldPrice}</del>` : ""}
              <strong>${item.price}</strong>
              ${item.discount ? `<em>${item.discount}</em>` : ""}
            </div>
          </article>
        `).join("")}
      </div>
    </section>

    <section class="all-courses-list section-pad">
      ${Object.entries(courseCatalog).map(renderCourseCard).join("")}
    </section>
  `;
} else {
  const resolvedCourseKey = courseCatalog[courseKey] ? courseKey : "ai-ml";
  const course = courseCatalog[resolvedCourseKey];

  document.title = `${course.title} Syllabus | Synapse`;
  updateCourseSeo(course, resolvedCourseKey);

  root.innerHTML = `
  <section class="course-hero section-pad">
    <div class="course-copy">
      <a class="back-link" href="course.html">Back to all courses</a>
      <p class="section-label">${course.eyebrow}</p>
      <h1>${course.title}</h1>
      <span class="course-status-badge ${courseKey === "ai-ml" ? "is-live" : ""}">${course.status}</span>
      <p>${course.summary}</p>
      ${course.duration ? `<div class="course-meta-pills"><span>⏱ ${course.duration}</span><span>💻 ${course.mode}</span><span>👥 ${course.batchSize}</span></div>` : ""}
      <div class="course-price-row hero-price">
        ${renderPrice(course)}
      </div>
      <div class="course-actions">
        <a class="btn btn-primary" href="${resolvedCourseKey === "cybersecurity" ? "#cyberInterest" : "index.html#contact"}">${course.cta}</a>
        <span class="coming-soon-badge">${course.status}</span>
      </div>
      ${resolvedCourseKey === "cybersecurity" ? `
      <form class="interest-box" id="cyberInterest">
        <label>
          Full name
          <input type="text" name="name" placeholder="Enter your name" required />
        </label>
        <label>
          Mobile number
          <input type="tel" name="phone" placeholder="+91 98765 43210" required />
        </label>
        <button class="btn btn-primary" type="submit">Show Interest</button>
        <p class="interest-status" role="status" aria-live="polite"></p>
      </form>` : ""}
      ${courseKey === "ai-ml" ? `
      <div class="payment-box">
        <button class="coupon-toggle" id="couponToggle">🏷 Apply Coupon</button>
        <div class="coupon-row" id="couponRow" style="display:none">
          <input type="text" id="couponInput" placeholder="Enter code" />
          <button class="btn btn-secondary" id="applyCoupon">Apply</button>
        </div>
        <p class="coupon-status" id="couponStatus"></p>
        <button class="btn btn-primary pay-btn" id="payBtn">Pay ${course.price}</button>
      </div>
      <div class="countdown-banner"><span class="countdown-label">Batch starts in</span><div class="countdown-timer" id="courseCountdown"></div></div><div class="seats-counter"><span class="pulse-dot"></span> Only <span id="seatsLeft">14</span> seats left</div>` : ""}
    </div>
    <figure class="course-poster">
      <img src="${course.poster}" alt="${course.title} course poster" loading="lazy" decoding="async" />
      <figcaption>Mentor: ${course.mentor} <span>${course.role}</span></figcaption>
    </figure>
  </section>

  <section class="course-overview section-pad">
    <div class="course-highlights">
      ${course.highlights.map((item) => `<article><span>${item.slice(0, 2)}</span><strong>${item}</strong></article>`).join("")}
    </div>
    <div class="syllabus-panel">
      <div class="section-heading">
        <p class="section-label">Syllabus</p>
        <h2>What students will learn.</h2>
      </div>
      <ol class="syllabus-list">
        ${course.syllabus.map((item) => `<li>${item}</li>`).join("")}
      </ol>
    </div>
  </section>

  <section class="course-projects section-pad">
    <div>
      <p class="section-label">Projects</p>
      <h2>Portfolio outcomes included.</h2>
    </div>
    <div class="project-list">
      ${course.projects.map((item) => `<article><strong>${item}</strong><span>Included in upcoming batch</span></article>`).join("")}
    </div>
  </section>

  ${course.whoIsItFor ? `
  <section class="course-who section-pad">
    <div>
      <p class="section-label">Who is it for</p>
      <h2>This course is designed for:</h2>
    </div>
    <ul class="who-list">
      ${course.whoIsItFor.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  </section>` : ""}

  ${course.outcomes ? `
  <section class="course-outcomes section-pad">
    <div>
      <p class="section-label">Outcomes</p>
      <h2>What you'll walk away with.</h2>
    </div>
    <ul class="outcomes-list">
      ${course.outcomes.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  </section>` : ""}

  ${course.certificate ? `
  <section class="course-cert-banner section-pad">
    <div class="cert-banner-card">
      <strong>🎓 ${course.certificate}</strong>
      <a class="btn btn-primary" href="index.html#contact">${course.cta}</a>
    </div>
  </section>` : ""}
`;
}

  initCountdown();
  initCyberInterestForm();
  initPayment();
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

// Countdown timer for AI & ML batch
function initCountdown() {
  const el = document.getElementById("courseCountdown");
  if (!el) return;
  const target = new Date("2026-06-20T00:00:00+05:30").getTime();
  function update() {
    const diff = target - Date.now();
    if (diff <= 0) { el.innerHTML = "<span class='countdown-label'>Batch is LIVE!</span>"; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.innerHTML = `<div class="cd-unit"><span class="cd-num">${d}</span><span class="cd-lbl">Days</span></div><div class="cd-unit"><span class="cd-num">${h}</span><span class="cd-lbl">Hrs</span></div><div class="cd-unit"><span class="cd-num">${m}</span><span class="cd-lbl">Min</span></div><div class="cd-unit"><span class="cd-num">${s}</span><span class="cd-lbl">Sec</span></div>`;
  }
  update();
  setInterval(update, 1000);
}

// Cybersecurity interest form
function initCyberInterestForm() {
  const form = document.getElementById("cyberInterest");
  if (!form) return;

  const status = form.querySelector(".interest-status");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    if (!name || !phone) {
      status.textContent = "Please enter your name and mobile number.";
      status.classList.add("is-error");
      return;
    }

    status.textContent = "Saving your interest...";
    status.classList.remove("is-error", "is-success");

    try {
      if (typeof saveLead !== "function") {
        throw new Error("Lead saving is not available");
      }

      const result = await saveLead({
        name,
        phone,
        program: "Cybersecurity",
        college: "",
        message: "Cybersecurity course interest"
      });

      if (result?.error) {
        throw result.error;
      }

      form.reset();
      status.textContent = "Thanks. Your interest in Cybersecurity has been saved.";
      status.classList.add("is-success");
    } catch (error) {
      status.textContent = "Could not save right now. Please try again.";
      status.classList.add("is-error");
    }
  });
}

// Coupon & Razorpay Payment
function initPayment() {
  const couponInput = document.getElementById("couponInput");
  const couponBtn = document.getElementById("applyCoupon");
  const couponStatus = document.getElementById("couponStatus");
  const payBtn = document.getElementById("payBtn");
  const couponToggle = document.getElementById("couponToggle");
  const couponRow = document.getElementById("couponRow");
  if (!payBtn) return;

  couponToggle?.addEventListener("click", () => {
    couponToggle.style.display = "none";
    couponRow.style.display = "flex";
    couponInput.focus();
  });

  const paymentCourse = courseCatalog["ai-ml"] || {};
  const basePrice = Number(String(paymentCourse.price || "999").replace(/\D/g, "")) || 999;
  let price = basePrice;

  couponBtn?.addEventListener("click", () => {
    const code = couponInput.value.trim().toUpperCase();
    const coupon = checkoutCoupons[code];
    if (coupon) {
      if (coupon.type === "percent") {
        price = Math.round(basePrice - (basePrice * coupon.discount / 100));
      } else {
        price = basePrice - coupon.discount;
      }
      if (price <= 0) price = 0;
      couponStatus.textContent = `✓ Coupon applied! You save ₹${basePrice - price}`;
      couponStatus.style.color = "#155f3c";
      payBtn.textContent = price === 0 ? "Enroll Free" : `Pay ₹${price}`;
    } else {
      couponStatus.textContent = "✗ Invalid coupon code";
      couponStatus.style.color = "#d32f2f";
    }
  });

  payBtn.addEventListener("click", async () => {
    // Require login first
    if (!window.Clerk) { alert("Loading... try again"); return; }
    try { await window.Clerk.load(); } catch(e) {}
    if (!window.Clerk.user) {
      if (typeof openClerkSignIn === "function") {
        openClerkSignIn();
      } else {
        window.Clerk.openSignIn();
      }
      // Wait for sign in then retry
      window.Clerk.addListener(({ user }) => { if (user) payBtn.click(); });
      return;
    }

    if (price === 0) {
      if (typeof saveEnrollment === "function") {
        await saveEnrollment({
          course: "AI & ML",
          paymentId: "FREE-COUPON",
          amount: 0
        });
      }
      alert("🎉 Congratulations! You have been enrolled for free.");
      window.location.href = "dashboard.html";
      return;
    }

    const userDetails = typeof getClerkUserDetails === "function" ? getClerkUserDetails() : {};

    const options = {
      key: "rzp_test_SrFYeqYJM1Ef3u",
      amount: price * 100,
      currency: "INR",
      name: "Synapse",
      description: "AI & ML 45-Day Internship",
      prefill: {
        name: userDetails.name || "",
        email: userDetails.email || "",
        contact: userDetails.phone || ""
      },
      handler: async function(response) {
        if (typeof saveEnrollment === "function") {
          await saveEnrollment({
            course: "AI & ML",
            paymentId: response.razorpay_payment_id,
            amount: price
          });
        }
        alert("Payment successful! ID: " + response.razorpay_payment_id);
        window.location.href = "dashboard.html";
      },
      theme: { color: "#343aa4" }
    };
    const rzp = new Razorpay(options);
    rzp.open();
  });
}

renderCoursePage();
loadAdminCourseConfig()
  .then(() => {
    renderCoursePage();
    watchAdminCourseConfig();
  })
  .catch(() => {
    watchAdminCourseConfig();
  });

// Auth handled by Clerk via supabase.js initClerkAuth()
