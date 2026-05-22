const upcomingWorkshops = document.getElementById("upcomingWorkshops");
const pastWorkshops = document.getElementById("pastWorkshops");

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
  const client = typeof getSupabaseClient === "function" ? getSupabaseClient() : null;
  if (!client || !upcomingWorkshops || !pastWorkshops) return;

  try {
    const { data, error } = await client.from("admin_workshops").select("*");
    if (error || !data?.length) return;

    const upcoming = data.filter((item) => item.status !== "past");
    const past = data.filter((item) => item.status === "past");

    if (upcoming.length) upcomingWorkshops.innerHTML = upcoming.map(renderWorkshop).join("");
    if (past.length) pastWorkshops.innerHTML = past.map(renderWorkshop).join("");
  } catch (error) {
    console.warn("Admin workshops unavailable", error);
  }
}

loadAdminWorkshops();
