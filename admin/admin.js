const ACCESS_CODE = "sana";
const ACCESS_KEY = "synapse_team_access";

const state = {
  activeView: "leads",
  records: {
    leads: [],
    purchases: [],
    users: [],
    workshops: [],
    courses: [],
    coupons: []
  }
};

const defaultCourses = {
  "ai-ml": {
    slug: "ai-ml",
    title: "AI & ML",
    mentor: "Udhay",
    role: "AI & ML Instructor",
    status: "Live from 20 June 2026",
    cta: "Apply Now",
    price: "₹999",
    old_price: "₹4,999",
    discount: "80% OFF",
    duration: "45 Days",
    poster: "assets/course-posters/ai-ml.png",
    summary: "A 45-day structured internship covering Python programming, data analysis, machine learning algorithms, deep learning, generative AI, and end-to-end project building. Students go from zero coding experience to deploying ML models and building AI-powered tools for their portfolio.",
    bundle: "Early bird sale price",
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
      "Week 1: Python foundations - variables, loops, functions, OOP, file handling, and debugging",
      "Week 2: Data toolkit - NumPy arrays, Pandas DataFrames, data cleaning, and Matplotlib/Seaborn visualization",
      "Week 3: Machine learning core - train/test split, linear regression, logistic regression, decision trees, random forests, and model evaluation metrics",
      "Week 4: Advanced ML & deep learning - SVMs, clustering, dimensionality reduction, intro to neural networks with TensorFlow/Keras",
      "Week 5: Generative AI - prompt engineering, OpenAI API, LangChain basics, building chatbots, and AI automation tools",
      "Week 6: Capstone project - end-to-end ML pipeline, model deployment basics, project documentation, resume integration, and mock interview preparation"
    ],
    projects: [
      "Student performance predictor using regression",
      "AI-powered resume analyzer with NLP",
      "Chatbot built with LLM and LangChain workflow",
      "Data dashboard with interactive visualizations",
      "Image classifier using deep learning"
    ]
  },
  cybersecurity: {
    slug: "cybersecurity",
    title: "Cybersecurity",
    mentor: "Sahil Khan",
    role: "Cybersecurity Expert",
    status: "Coming Soon",
    cta: "Show Interest",
    price: "Coming Soon",
    old_price: "",
    discount: "",
    duration: "",
    poster: "assets/course-posters/cybersecurity.png",
    summary: "Go from security basics to practical ethical hacking, network defense, Kali Linux tools, bug hunting and career roadmap.",
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
    youtube_url: "#",
    google_meet_url: "#",
    updated_at: ""
  },
  {
    id: "prompt-engineering-intro",
    title: "Introduction to Prompt Engineering",
    host: "Udhay",
    status: "past",
    day: "SUN",
    date: "18",
    month: "May",
    time: "",
    youtube_url: "#",
    google_meet_url: "",
    updated_at: ""
  }
];

const defaultCoupons = [
  { code: "STAY10", course_slug: "ai-ml", type: "percent", discount: 10, usage_limit: 0, used_count: 0, active: true, expires_at: "", updated_at: "" },
  { code: "SYNAPSE100", course_slug: "ai-ml", type: "flat", discount: 100, usage_limit: 0, used_count: 0, active: true, expires_at: "", updated_at: "" },
  { code: "EARLY50", course_slug: "ai-ml", type: "flat", discount: 50, usage_limit: 0, used_count: 0, active: true, expires_at: "", updated_at: "" },
  { code: "REFER100", course_slug: "ai-ml", type: "flat", discount: 100, usage_limit: 0, used_count: 0, active: true, expires_at: "", updated_at: "" },
  { code: "MANSOOR", course_slug: "ai-ml", type: "percent", discount: 100, usage_limit: 0, used_count: 0, active: true, expires_at: "", updated_at: "" }
];

const views = {
  leads: {
    title: "Leads",
    subtitle: "Students who requested details or showed interest.",
    table: "leads",
    columns: ["name", "phone", "program", "college", "message", "created_at"]
  },
  purchases: {
    title: "Purchases",
    subtitle: "Course purchases and enrollment payment records.",
    table: "purchases",
    columns: ["name", "phone", "email", "course", "amount", "payment_id", "status", "created_at"]
  },
  users: {
    title: "Students",
    subtitle: "Student profiles saved after signup or enrollment.",
    table: "users",
    columns: ["name", "phone", "email", "college", "clerk_id", "updated_at"]
  },
  workshops: {
    title: "Workshops",
    subtitle: "Upcoming and past workshop content, YouTube links, and Google Meet links.",
    table: "admin_workshops",
    localKey: "synapse_admin_workshops",
    columns: ["id", "title", "host", "status", "time", "youtube_url", "google_meet_url", "updated_at", "actions"]
  },
  courses: {
    title: "Courses",
    subtitle: "Course copy, poster PNG, mentor details, pricing, and status.",
    table: "admin_courses",
    localKey: "synapse_admin_courses",
    columns: ["slug", "title", "mentor", "status", "price", "old_price", "discount", "poster", "updated_at", "actions"]
  },
  coupons: {
    title: "Coupons",
    subtitle: "Discount codes for checkout. Usage limit 0 means unlimited.",
    table: "admin_coupons",
    localKey: "synapse_admin_coupons",
    columns: ["code", "course_slug", "type", "discount", "usage_limit", "used_count", "active", "expires_at", "actions"]
  }
};

const accessPanel = document.getElementById("accessPanel");
const accessForm = document.getElementById("accessForm");
const accessCode = document.getElementById("accessCode");
const accessStatus = document.getElementById("accessStatus");
const dashboard = document.getElementById("dashboard");
const refreshBtn = document.getElementById("refreshBtn");
const lockBtn = document.getElementById("lockBtn");
const searchInput = document.getElementById("searchInput");
const exportBtn = document.getElementById("exportBtn");
const loadStatus = document.getElementById("loadStatus");
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const emptyState = document.getElementById("emptyState");
const viewTitle = document.getElementById("viewTitle");
const viewSubtitle = document.getElementById("viewSubtitle");

function hasAccess() {
  return sessionStorage.getItem(ACCESS_KEY) === "1";
}

function setAccess(isAllowed) {
  sessionStorage.setItem(ACCESS_KEY, isAllowed ? "1" : "0");
  accessPanel.hidden = isAllowed;
  dashboard.hidden = !isAllowed;

  if (isAllowed) {
    loadDashboard();
  }
}

accessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (accessCode.value.trim() !== ACCESS_CODE) {
    accessStatus.textContent = "Incorrect access code.";
    return;
  }

  accessStatus.textContent = "";
  accessCode.value = "";
  setAccess(true);
});

lockBtn.addEventListener("click", () => {
  sessionStorage.removeItem(ACCESS_KEY);
  accessPanel.hidden = false;
  dashboard.hidden = true;
});

refreshBtn.addEventListener("click", () => loadDashboard());

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.activeView = button.dataset.view;
    searchInput.value = "";
    renderCurrentView();
  });
});

searchInput.addEventListener("input", renderCurrentView);

exportBtn.addEventListener("click", () => {
  const rows = getFilteredRecords();
  const view = views[state.activeView];
  const csv = [
    view.columns.join(","),
    ...rows.map((row) => view.columns.map((column) => csvCell(row[column])).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `synapse-${state.activeView}.csv`;
  link.click();
  URL.revokeObjectURL(url);
});

function openManagerPanel(type, shouldScroll = true) {
  document.querySelectorAll("[data-manager-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.managerPanel !== type;
  });

  const panel = document.querySelector(`[data-manager-panel="${type}"]`);
  if (panel && shouldScroll) {
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return panel;
}

document.querySelectorAll("[data-open-manager]").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.openManager;
    const panel = openManagerPanel(type);
    const form = panel?.tagName === "FORM" ? panel : null;
    if (form) form.reset();

    if (type === "workshop") {
      document.getElementById("workshopStatus").textContent = "Blank workshop ready. Add details and save.";
    }
    if (type === "course") {
      document.getElementById("courseStatus").textContent = "Blank course ready. Add details and save.";
    }
    if (type === "coupon") {
      document.getElementById("couponStatus").textContent = "Blank coupon ready. Add code details and save.";
    }
  });
});

document.getElementById("workshopForm").addEventListener("submit", (event) => {
  event.preventDefault();
  saveManagerRecord("workshops", readWorkshopForm(event.currentTarget), "workshopStatus", "Workshop saved.");
});

document.getElementById("courseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  saveManagerRecord("courses", readCourseForm(event.currentTarget), "courseStatus", "Course saved.");
});

document.getElementById("couponForm").addEventListener("submit", (event) => {
  event.preventDefault();
  saveManagerRecord("coupons", readCouponForm(event.currentTarget), "couponStatus", "Coupon saved.");
});

document.getElementById("deleteCouponBtn").addEventListener("click", () => {
  const code = document.querySelector('#couponForm [name="code"]').value.trim().toUpperCase();
  deleteCoupon(code);
});

document.getElementById("newWorkshopBtn").addEventListener("click", () => {
  openManagerPanel("workshop", false);
  const form = document.getElementById("workshopForm");
  form.reset();
  document.getElementById("workshopStatus").textContent = "Blank workshop ready. Add details and save.";
});

document.getElementById("newCourseBtn").addEventListener("click", () => {
  openManagerPanel("course", false);
  const form = document.getElementById("courseForm");
  form.reset();
  document.getElementById("courseStatus").textContent = "Blank course ready. Add details and save.";
});

document.querySelectorAll("[data-course-preset]").forEach((button) => {
  button.addEventListener("click", () => {
    const course = defaultCourses[button.dataset.coursePreset];
    if (course) fillCourseForm(course);
  });
});

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function getClient() {
  return typeof getSupabaseClient === "function" ? getSupabaseClient() : null;
}

async function loadDashboard() {
  const client = getClient();
  if (!client) {
    loadStatus.textContent = "Supabase not available";
    return;
  }

  loadStatus.textContent = "Loading...";

  const entries = await Promise.all(
    Object.entries(views).map(async ([key, view]) => {
      const { data, error } = await client.from(view.table).select("*");
      const fallbackRows = getFallbackRows(key);
      const localRows = readLocalRows(view.localKey);
      if (!error) {
        const syncedRows = await syncLocalRows(key, view, localRows);
        const remoteRows = syncedRows.length ? mergeRows(data || [], syncedRows, key) : data || [];
        return [key, sortRecords(mergeRows(fallbackRows, remoteRows, key))];
      }
      return [key, sortRecords(mergeRows(fallbackRows, localRows, key))];
    })
  );

  entries.forEach(([key, rows]) => {
    state.records[key] = rows;
  });

  updateMetrics();
  renderCurrentView();
  loadStatus.textContent = "Updated";
}

function readLocalRows(key) {
  if (!key) return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function writeLocalRow(key, row, idKey) {
  if (!key) return;
  const rows = readLocalRows(key);
  const next = rows.filter((item) => item[idKey] !== row[idKey]);
  next.unshift(row);
  localStorage.setItem(key, JSON.stringify(next));
}

function deleteLocalRow(key, idKey, idValue) {
  if (!key) return;
  const rows = readLocalRows(key);
  localStorage.setItem(key, JSON.stringify(rows.filter((item) => item[idKey] !== idValue)));
}

async function syncLocalRows(viewKey, view, rows) {
  if (!view.localKey || !rows.length) return [];

  const idKey = viewKey === "courses" ? "slug" : viewKey === "coupons" ? "code" : "id";
  const client = getClient();
  if (!client) return rows;

  const { error } = await client.from(view.table).upsert(rows, { onConflict: idKey });
  if (error) return rows;

  localStorage.removeItem(view.localKey);
  return rows;
}

function getFallbackRows(key) {
  if (key === "courses") return Object.values(defaultCourses);
  if (key === "workshops") return defaultWorkshops;
  if (key === "coupons") return defaultCoupons;
  return [];
}

function mergeRows(baseRows, overrideRows, key) {
  const idKey = key === "courses" ? "slug" : key === "coupons" ? "code" : "id";
  const map = new Map();
  baseRows.forEach((row) => map.set(row[idKey], row));
  overrideRows.forEach((row) => {
    if (row.deleted) {
      map.delete(row[idKey]);
      return;
    }
    map.set(row[idKey], row);
  });
  return Array.from(map.values());
}

function fillWorkshopForm(workshop) {
  const form = document.getElementById("workshopForm");
  Object.entries(workshop).forEach(([key, value]) => {
    const field = form.querySelector(`[name="${key}"]`);
    if (!field) return;
    if (key === "resources" && Array.isArray(value)) {
      field.value = value.map((item) => `${item.label || "Resource"}|${item.url || "#"}`).join("\n");
      return;
    }
    field.value = Array.isArray(value) ? value.join("\n") : value || "";
  });

  const status = document.getElementById("workshopStatus");
  status.textContent = `${workshop.title} loaded. Edit and save when ready.`;
  status.className = "form-status is-success";
}

function fillCourseForm(course) {
  const form = document.getElementById("courseForm");
  Object.entries(course).forEach(([key, value]) => {
    const field = form.querySelector(`[name="${key}"]`);
    if (!field) return;
    field.value = Array.isArray(value) ? value.join("\n") : value || "";
  });

  const status = document.getElementById("courseStatus");
  status.textContent = `${course.title} details loaded. Edit and save when ready.`;
  status.className = "form-status is-success";
}

function fillCouponForm(coupon) {
  const form = document.getElementById("couponForm");
  Object.entries(coupon).forEach(([key, value]) => {
    const field = form.querySelector(`[name="${key}"]`);
    if (!field) return;
    if (key === "expires_at" && value) {
      field.value = toDateTimeLocal(value);
      return;
    }
    field.value = value == null ? "" : String(value);
  });

  const status = document.getElementById("couponStatus");
  status.textContent = `${coupon.code} loaded. Edit, save, or delete it.`;
  status.className = "form-status is-success";
}

async function deleteCoupon(code) {
  const status = document.getElementById("couponStatus");
  if (!code) {
    status.textContent = "Enter coupon code to delete.";
    status.className = "form-status is-error";
    return;
  }

  status.textContent = "Deleting...";
  status.className = "form-status";

  const client = getClient();
  let error = null;
  if (client) {
    const result = await client.from(views.coupons.table).upsert({
      code,
      active: false,
      deleted: true,
      updated_at: new Date().toISOString()
    }, { onConflict: "code" });
    error = result.error;
  }

  writeLocalRow(views.coupons.localKey, {
    code,
    active: false,
    deleted: true,
    updated_at: new Date().toISOString()
  }, "code");
  state.records.coupons = state.records.coupons.filter((item) => item.code !== code);

  if (error || !client) {
    status.textContent = "Coupon deleted from local drafts. Supabase table may not exist yet.";
  } else {
    status.textContent = "Coupon deleted.";
  }

  status.classList.add("is-success");
  document.getElementById("couponForm").reset();
  renderCurrentView();
}

async function saveManagerRecord(viewKey, record, statusId, successMessage) {
  const view = views[viewKey];
  const status = document.getElementById(statusId);
  const idKey = viewKey === "courses" ? "slug" : viewKey === "coupons" ? "code" : "id";

  status.textContent = "Saving...";
  status.className = "form-status";

  const row = {
    ...record,
    updated_at: new Date().toISOString()
  };

  const client = getClient();
  let error = null;
  if (client) {
    const result = await client.from(view.table).upsert(row, { onConflict: idKey });
    error = result.error;
  }

  if (!client) {
    writeLocalRow(view.localKey, row, idKey);
    status.textContent = `${successMessage} Local draft saved. Supabase did not load in this browser. Refresh and try again.`;
    status.classList.add("is-success");
  } else if (error) {
    writeLocalRow(view.localKey, row, idKey);
    status.textContent = `${successMessage} Local draft saved. Supabase sync failed: ${error.message || "unknown error"}.`;
    status.classList.add("is-success");
  } else {
    status.textContent = successMessage;
    status.classList.add("is-success");
  }

  await loadDashboard();
}

function readWorkshopForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  return {
    id: cleanId(data.id),
    title: clean(data.title),
    host: clean(data.host),
    status: clean(data.status) || "upcoming",
    day: clean(data.day),
    date: clean(data.date),
    month: clean(data.month),
    time: clean(data.time),
    description: clean(data.description),
    youtube_url: clean(data.youtube_url),
    google_meet_url: clean(data.google_meet_url),
    details: splitLines(data.details),
    resources: splitResourceLines(data.resources)
  };
}

function readCourseForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  return {
    slug: cleanId(data.slug),
    title: clean(data.title),
    mentor: clean(data.mentor),
    role: clean(data.role),
    status: clean(data.status),
    cta: clean(data.cta),
    price: clean(data.price),
    old_price: clean(data.old_price),
    discount: clean(data.discount),
    duration: clean(data.duration),
    poster: clean(data.poster),
    summary: clean(data.summary),
    bundle: clean(data.bundle),
    highlights: splitLines(data.highlights),
    syllabus: splitLines(data.syllabus),
    projects: splitLines(data.projects)
  };
}

function readCouponForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  return {
    code: clean(data.code).toUpperCase(),
    course_slug: cleanId(data.course_slug || "ai-ml"),
    type: clean(data.type) || "flat",
    discount: Number(data.discount || 0),
    usage_limit: Number(data.usage_limit || 0),
    used_count: Number(data.used_count || 0),
    active: data.active === "true",
    expires_at: data.expires_at ? new Date(data.expires_at).toISOString() : null
  };
}

function clean(value) {
  return String(value || "").trim();
}

function cleanId(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, "");
}

function splitLines(value) {
  return clean(value).split("\n").map((item) => item.trim()).filter(Boolean);
}

function splitResourceLines(value) {
  return splitLines(value).map((line) => {
    const [label, url] = line.split("|").map((part) => part.trim());
    return { label: label || "Resource", url: url || "#" };
  });
}

function sortRecords(rows) {
  return rows.slice().sort((a, b) => {
    const first = new Date(b.created_at || b.updated_at || 0).getTime();
    const second = new Date(a.created_at || a.updated_at || 0).getTime();
    return first - second;
  });
}

function updateMetrics() {
  document.getElementById("leadCount").textContent = state.records.leads.length;
  document.getElementById("purchaseCount").textContent = state.records.purchases.length;
  document.getElementById("userCount").textContent = state.records.users.length;

  const revenue = state.records.purchases.reduce((sum, item) => {
    const amount = Number(item.amount || 0);
    return Number.isFinite(amount) ? sum + amount : sum;
  }, 0);
  document.getElementById("revenueTotal").textContent = `₹${revenue.toLocaleString("en-IN")}`;
}

function getFilteredRecords() {
  const query = searchInput.value.trim().toLowerCase();
  const rows = state.records[state.activeView] || [];
  if (!query) return rows;

  return rows.filter((row) => Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(query)));
}

function renderCurrentView() {
  const view = views[state.activeView];
  const rows = getFilteredRecords();

  viewTitle.textContent = view.title;
  viewSubtitle.textContent = view.subtitle;
  tableHead.innerHTML = `<tr>${view.columns.map((column) => `<th>${formatHeader(column)}</th>`).join("")}</tr>`;
  tableBody.innerHTML = rows.map((row) => renderRow(row, view.columns, state.activeView)).join("");
  emptyState.hidden = rows.length > 0;
}

function renderRow(row, columns, viewKey) {
  return `<tr>${columns.map((column) => `<td>${renderCell(row, column, viewKey)}</td>`).join("")}</tr>`;
}

function renderCell(row, column, viewKey) {
  if (column === "actions" && viewKey === "workshops") {
    return `
      <div class="row-actions">
        <button class="ghost-btn" type="button" data-edit-workshop="${escapeAttr(row.id)}">Edit</button>
      </div>
    `;
  }

  if (column === "actions" && viewKey === "courses") {
    return `
      <div class="row-actions">
        <button class="ghost-btn" type="button" data-edit-course="${escapeAttr(row.slug)}">Edit</button>
      </div>
    `;
  }

  if (column === "actions" && viewKey === "coupons") {
    return `
      <div class="row-actions">
        <button class="ghost-btn" type="button" data-edit-coupon="${escapeAttr(row.code)}">Edit</button>
        <button class="danger-btn" type="button" data-delete-coupon="${escapeAttr(row.code)}">Delete</button>
      </div>
    `;
  }

  return formatValue(row[column]);
}

function formatHeader(key) {
  return key.replaceAll("_", " ");
}

function formatValue(value) {
  if (value == null || value === "") return "-";
  if (Array.isArray(value)) return value.map((item) => typeof item === "string" ? item : JSON.stringify(item)).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleString("en-IN");
  }
  return String(value);
}

function escapeAttr(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function toDateTimeLocal(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

tableBody.addEventListener("click", (event) => {
  const editWorkshopButton = event.target.closest("[data-edit-workshop]");
  if (editWorkshopButton) {
    openManagerPanel("workshop");
    const workshop = state.records.workshops.find((item) => item.id === editWorkshopButton.dataset.editWorkshop);
    if (workshop) fillWorkshopForm(workshop);
    return;
  }

  const editCourseButton = event.target.closest("[data-edit-course]");
  if (editCourseButton) {
    openManagerPanel("course");
    const course = state.records.courses.find((item) => item.slug === editCourseButton.dataset.editCourse);
    if (course) fillCourseForm(course);
    return;
  }

  const editButton = event.target.closest("[data-edit-coupon]");
  if (editButton) {
    openManagerPanel("coupon");
    const coupon = state.records.coupons.find((item) => item.code === editButton.dataset.editCoupon);
    if (coupon) fillCouponForm(coupon);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-coupon]");
  if (deleteButton) {
    deleteCoupon(deleteButton.dataset.deleteCoupon);
  }
});

setAccess(hasAccess());
