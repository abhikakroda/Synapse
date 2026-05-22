const upcomingWorkshops = document.getElementById("upcomingWorkshops");
const pastWorkshops = document.getElementById("pastWorkshops");

const defaultWorkshops = [
  {
    id: "agentic-ai-claude",
    title: "Agentic AI & Claude AI",
    host: "Udhay",
    status: "upcoming",
    day: "SUN",
    date: "25",
    month: "May",
    time: "Sunday, 4:00 PM IST",
    description: "Build autonomous AI agents using Claude from prompt design to tool use and multi-step reasoning.",
    youtube_url: "#",
    google_meet_url: "#",
    details: [
      "What are AI agents and why they matter in 2026",
      "Claude AI tool use, multi-step reasoning, and MCP",
      "Building your first agentic workflow from scratch",
      "Real-world use cases: coding agents, research agents, automation"
    ],
    resources: [
      { label: "Workshop Slides (PDF)", url: "#" },
      { label: "Hands-on Notebook", url: "#" },
      { label: "Claude AI Documentation", url: "#" },
      { label: "WhatsApp Group", url: "#" }
    ]
  },
  {
    id: "prompt-engineering-intro",
    title: "Introduction to Prompt Engineering",
    host: "Udhay",
    status: "past",
    day: "SUN",
    date: "18",
    month: "May",
    description: "Basics of writing effective prompts for ChatGPT, Claude, and Gemini.",
    youtube_url: "#",
    google_meet_url: "",
    details: [],
    resources: []
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

function linkOrHash(value) {
  return value || "#";
}

function asList(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split("\n").map((item) => item.trim()).filter(Boolean);
}

function readLocalRows(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function mergeWorkshops(baseRows, overrideRows) {
  const map = new Map();
  [...baseRows, ...overrideRows].forEach((row) => {
    if (!row?.id) return;
    if (row.deleted) {
      map.delete(row.id);
      return;
    }
    map.set(row.id, row);
  });
  return Array.from(map.values());
}

function sortWorkshops(rows) {
  return rows.slice().sort((a, b) => {
    const first = new Date(b.updated_at || 0).getTime();
    const second = new Date(a.updated_at || 0).getTime();
    return first - second;
  });
}

function renderResourceLinks(resources) {
  const items = Array.isArray(resources) ? resources : [];
  if (!items.length) return "";

  return `
    <h4>Resources & Links</h4>
    <div class="workshop-resources">
      ${items.map((item) => `
        <a href="${escapeHtml(linkOrHash(item.url))}" class="resource-link" target="_blank">${escapeHtml(item.label || "Resource")}</a>
      `).join("")}
    </div>
  `;
}

function renderDetails(workshop) {
  const details = asList(workshop.details);
  if (!details.length && !workshop.resources?.length) return "";

  return `
    <details class="workshop-details">
      <summary>See more details</summary>
      <div class="workshop-details-body">
        ${details.length ? `
          <h4>What you'll learn</h4>
          <ul>${details.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        ` : ""}
        ${renderResourceLinks(workshop.resources)}
      </div>
    </details>
  `;
}

function renderWorkshop(workshop) {
  const isPast = workshop.status === "past";
  const youtubeText = isPast ? "Watch Recording" : "Join YouTube Live";

  return `
    <article class="workshop-card ${isPast ? "workshop-past" : ""}">
      <div class="workshop-date">
        <span>${escapeHtml(workshop.day || "SUN")}</span>
        <strong>${escapeHtml(workshop.date || "--")}</strong>
        <span>${escapeHtml(workshop.month || "")}</span>
      </div>
      <div class="workshop-info">
        <h3>${escapeHtml(workshop.title)}</h3>
        <p>${escapeHtml(workshop.description || "")}</p>
        <div class="workshop-meta">
          <span class="workshop-host">By ${escapeHtml(workshop.host || "Synapse Team")}</span>
          <span class="workshop-platform workshop-yt">▶ ${isPast ? "YouTube" : "YouTube Live"}</span>
          ${workshop.time ? `<span class="workshop-time">${escapeHtml(workshop.time)}</span>` : ""}
        </div>
        <div class="workshop-actions">
          <a class="btn ${isPast ? "btn-secondary" : "btn-primary"}" href="${escapeHtml(linkOrHash(workshop.youtube_url))}" target="_blank">${youtubeText}</a>
          ${!isPast ? `<a class="btn btn-secondary" href="${escapeHtml(linkOrHash(workshop.google_meet_url))}" target="_blank">Join Google Meet</a>` : ""}
        </div>
        ${renderDetails(workshop)}
      </div>
    </article>
  `;
}

async function loadAdminWorkshops() {
  if (!upcomingWorkshops || !pastWorkshops) return;

  const client = typeof getSupabaseClient === "function" ? getSupabaseClient() : null;
  const localRows = readLocalRows("synapse_admin_workshops");
  let rows = mergeWorkshops(defaultWorkshops, localRows);

  try {
    if (client) {
    const { data, error } = await client.from("admin_workshops").select("*");
      if (!error) rows = mergeWorkshops(rows, data || []);
    }
  } catch (error) {
    console.warn("Admin workshops unavailable", error);
  }

  const upcoming = sortWorkshops(rows.filter((item) => item.status !== "past"));
  const past = sortWorkshops(rows.filter((item) => item.status === "past"));

  upcomingWorkshops.innerHTML = upcoming.length
    ? upcoming.map(renderWorkshop).join("")
    : `<p class="empty-state">No upcoming workshops yet.</p>`;
  pastWorkshops.innerHTML = past.length
    ? past.map(renderWorkshop).join("")
    : `<p class="empty-state">No past workshops yet.</p>`;
}

loadAdminWorkshops();
