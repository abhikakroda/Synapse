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
  const program = String(formData.get("program") || "selected program").trim();

  statusMessage.textContent = `Thanks ${name}. Your enquiry for ${program} is ready to send to the Synapse team.`;
  leadForm.reset();
});
