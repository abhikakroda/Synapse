const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const filterButtons = document.querySelectorAll("[data-filter]");
const programCards = document.querySelectorAll(".program-card");
const leadForm = document.querySelector("#leadForm");
const statusMessage = document.querySelector(".form-status");

const updateSeoUrls = () => {
  if (window.location.protocol === "file:") {
    return;
  }

  const pageUrl = window.location.href.split("#")[0];
  const origin = window.location.origin;
  const canonical = document.querySelector('link[rel="canonical"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  const twitterImage = document.querySelector('meta[name="twitter:image"]');

  canonical?.setAttribute("href", pageUrl);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", pageUrl);

  if (ogImage) {
    ogImage.setAttribute("content", `${origin}/assets/synopse-concept.png`);
  }

  if (twitterImage) {
    twitterImage.setAttribute("content", `${origin}/assets/synopse-concept.png`);
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: "Synapse",
        url: pageUrl,
        logo: `${origin}/assets/synopse-concept.png`,
        description:
          "Synapse provides internship and career acceleration programs for Indian college students."
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: "Synapse",
        url: pageUrl,
        publisher: {
          "@id": `${origin}/#organization`
        },
        inLanguage: "en-IN"
      },
      {
        "@type": "ItemList",
        name: "Synapse career tracks",
        itemListElement: [
          ["AI & ML Internship", "course.html?course=ai-ml"],
          ["Cybersecurity Course", "course.html?course=cybersecurity"],
          ["Aptitude & Placement Training", "course.html?course=aptitude-placement"],
          ["IoT Course", "course.html?course=iot"]
        ].map(([name, url], index) => ({
          "@type": "ListItem",
          position: index + 1,
          name,
          url: new URL(url, origin).href
        }))
      }
    ]
  };
  const jsonLd = document.createElement("script");
  jsonLd.type = "application/ld+json";
  jsonLd.textContent = JSON.stringify(schema);
  document.head.appendChild(jsonLd);
};

updateSeoUrls();

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

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    programCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(leadForm);
  const name = String(formData.get("name") || "Student").trim();
  const phone = String(formData.get("phone") || "").trim();
  const program = String(formData.get("program") || "selected program").trim();
  const message = String(formData.get("message") || "").trim();

  submitToSheet({ name, phone, program, message });

  statusMessage.textContent = `Thanks ${name}. Your enquiry for ${program} is ready to send to the Synapse team.`;
  leadForm.reset();
  fireConfetti();
});

// Confetti
function fireConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;z-index:9999;pointer-events:none";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: Math.random() * 6 + 4,
    dx: (Math.random() - 0.5) * 4,
    dy: Math.random() * 4 + 2,
    color: ["#343aa4", "#25d366", "#ffd700", "#ec7a38", "#646cff"][Math.floor(Math.random() * 5)],
    rot: Math.random() * 360
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.dx; p.y += p.dy; p.rot += 3;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();
    });
    frame++;
    if (frame < 120) requestAnimationFrame(draw);
    else canvas.remove();
  }
  draw();
}

// Sticky enroll bar
(function stickyBar() {
  const bar = document.createElement("div");
  bar.className = "sticky-enroll-bar";
  bar.innerHTML = `<span>AI & ML Internship — ₹999 (80% off)</span><a class="btn btn-primary" href="course.html?course=ai-ml">Enroll Now</a>`;
  document.body.appendChild(bar);
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const observer = new IntersectionObserver(([e]) => {
    bar.classList.toggle("visible", !e.isIntersecting);
  }, { threshold: 0 });
  observer.observe(hero);
})();

// Live activity feed
(function activityFeed() {
  const names = ["Rahul from Delhi", "Priya from Mumbai", "Arjun from Bangalore", "Sneha from Pune", "Vikram from Jaipur", "Ananya from Hyderabad", "Karan from Chennai", "Neha from Lucknow"];
  const actions = ["just enrolled", "joined the AI & ML batch", "signed up for the internship", "registered for the workshop"];
  function showToast() {
    const toast = document.createElement("div");
    toast.className = "activity-toast";
    const name = names[Math.floor(Math.random() * names.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const mins = Math.floor(Math.random() * 5) + 1;
    toast.innerHTML = `<strong>${name}</strong> ${action} <small>${mins} min ago</small>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 400); }, 4000);
  }
  setTimeout(showToast, 12000);
  setInterval(showToast, 45000);
})();

// Exit-intent popup
(function exitIntent() {
  let shown = false;
  document.addEventListener("mouseout", (e) => {
    if (shown || e.clientY > 5) return;
    shown = true;
    const overlay = document.createElement("div");
    overlay.className = "exit-popup-overlay";
    overlay.innerHTML = `<div class="exit-popup"><button class="exit-close" aria-label="Close">✕</button><h3>Wait! Get 10% extra off</h3><p>Use code <strong>STAY10</strong> at checkout for an additional 10% discount on any course.</p><a class="btn btn-primary" href="course.html?course=ai-ml">Claim Offer</a></div>`;
    document.body.appendChild(overlay);
    overlay.querySelector(".exit-close").onclick = () => overlay.remove();
    overlay.addEventListener("click", (ev) => { if (ev.target === overlay) overlay.remove(); });
  });
})();

// Animated student counter
(function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let current = 0;
      const step = Math.ceil(target / 40);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = current + "+";
      }, 30);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
})();

// Back to top button
(function backToTop() {
  const btn = document.createElement("button");
  btn.className = "back-to-top";
  btn.innerHTML = "↑";
  btn.setAttribute("aria-label", "Back to top");
  document.body.appendChild(btn);
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 600);
  }, { passive: true });
})();

// Page transition fade
(function pageTransition() {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 300ms ease";
  requestAnimationFrame(() => { document.body.style.opacity = "1"; });
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.href.includes("#")) return;
    if (link.hostname !== window.location.hostname) return;
    e.preventDefault();
    document.body.style.opacity = "0";
    setTimeout(() => { window.location.href = link.href; }, 250);
  });
})();

// Google Sheets backend
function submitToSheet(data) {
  const SHEET_URL = "https://script.google.com/macros/s/AKfycbx_iBGTnWFc3602w0YyAzE133dPIi1knjX5Lxz832SsKrIlFzsqmgICYvYoTrIQeh0/exec";
  fetch(SHEET_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).catch(() => {});
}

// Send lead form to Sheets (handled in main submit handler above)

// Email capture popup (once per session, after 8s)
(function emailPopup() {
  if (sessionStorage.getItem("emailShown")) return;
  setTimeout(() => {
    sessionStorage.setItem("emailShown", "1");
    const o = document.createElement("div");
    o.className = "exit-popup-overlay";
    o.innerHTML = `<div class="exit-popup"><button class="exit-close" aria-label="Close">✕</button><h3>Get free Python PDF</h3><p>Enter your email and we'll send you our Python Basics PDF with practice questions.</p><form class="email-popup-form"><input type="email" placeholder="your@email.com" required /><button class="btn btn-primary" type="submit">Send PDF</button></form><p class="email-popup-status"></p></div>`;
    document.body.appendChild(o);
    o.querySelector(".exit-close").onclick = () => o.remove();
    o.addEventListener("click", (ev) => { if (ev.target === o) o.remove(); });
    o.querySelector("form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      submitToSheet({ name: "PDF Request", phone: "", program: "Python PDF", message: ev.target.querySelector("input").value });
      o.querySelector(".email-popup-status").textContent = "✓ Check your email shortly!";
      ev.target.reset();
      setTimeout(() => o.remove(), 2000);
    });
  }, 8000);
})();
