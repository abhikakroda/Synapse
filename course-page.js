const courseCatalog = {
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
    cta: "Notify Me",
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
  },
  "aptitude-placement": {
    title: "Aptitude & Placement",
    eyebrow: "Complete course",
    poster: "assets/course-posters/aptitude-placement.png",
    mentor: "Afran Choudhary",
    role: "Aptitude & Placement Trainer",
    summary:
      "Prepare for campus hiring with quantitative aptitude, logical reasoning, verbal ability, resume building, HR prep and mock tests.",
    status: "Coming Soon",
    cta: "Notify Me",
    price: "Coming Soon",
    bundle: "Enrollment will open after the AI & ML launch.",
    highlights: ["Quantitative aptitude", "Logical reasoning", "Verbal ability", "Interview prep"],
    syllabus: [
      "Number system, percentages, ratio, time and work, speed and distance",
      "Logical reasoning, puzzles, seating arrangement and data interpretation",
      "Verbal ability, grammar, reading comprehension and communication practice",
      "Resume building, LinkedIn basics and project storytelling",
      "HR interview questions, group discussion and confidence practice",
      "Mock tests, placement strategy and improvement plan"
    ],
    projects: ["Resume improvement sprint", "Mock interview scorecard", "Campus placement tracker"]
  },
  iot: {
    title: "IoT Mastery",
    eyebrow: "Complete course",
    poster: "assets/course-posters/iot.png",
    mentor: "Abhishek Meena",
    role: "IoT Mentor",
    summary:
      "Build practical IoT skills with microcontrollers, sensors, cloud dashboards, automation and hands-on connected device projects.",
    status: "Coming Soon",
    cta: "Notify Me",
    price: "Coming Soon",
    bundle: "Enrollment will open after the AI & ML launch.",
    highlights: ["Arduino basics", "Sensors", "Cloud dashboard", "Automation"],
    syllabus: [
      "IoT fundamentals, hardware workflow and safety basics",
      "Arduino/ESP board setup, digital and analog input-output",
      "Sensor integration, ultrasonic, temperature, light and motion modules",
      "Wi-Fi connectivity, MQTT/HTTP basics and cloud data logging",
      "Dashboard design, alerts, automation and real-world applications",
      "Final IoT project with documentation, demo and certificate review"
    ],
    projects: ["Smart room monitor", "Sensor dashboard", "Wi-Fi automation prototype"]
  }
};

const params = new URLSearchParams(window.location.search);
const courseKey = params.get("course");
const root = document.querySelector("#courseRoot");

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
    : "Compare Synapse AI & ML, cybersecurity, aptitude and placement, and IoT internship courses with syllabus, mentor details, projects, pricing, and batch status.";

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

if (!courseKey) {
  document.title = "All Courses & Pricing | Synapse";
  updateCourseSeo();

  root.innerHTML = `
    <section class="all-courses-hero section-pad">
      <p class="section-label">Course</p>
      <h1>All 4 courses. See more for full details.</h1>
      <p>
        AI & ML is live from 20 June 2026 with early bird pricing. The other
        three tracks are listed here and will open soon.
      </p>
      <div class="course-summary-pricing">
        <article class="sale-summary-card">
          <span>AI & ML early bird sale</span>
          <div>
            <del>₹4,999</del>
            <strong>₹999</strong>
            <em>80% OFF</em>
          </div>
        </article>
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
        <a class="btn btn-primary" href="index.html#contact">${course.cta}</a>
        <span class="coming-soon-badge">${course.status}</span>
      </div>
      ${courseKey === "ai-ml" ? `<div class="countdown-banner"><span class="countdown-label">Batch starts in</span><div class="countdown-timer" id="courseCountdown"></div></div>` : ""}
    </div>
    <figure class="course-poster">
      <img src="${course.poster}" alt="${course.title} course poster" />
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
(function initCountdown() {
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
})();
