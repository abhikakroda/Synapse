const ACCESS_CODE = "sana";
const ACCESS_KEY = "openzara_team_access";

const state = {
  activeView: "leads",
  records: {
    leads: [],
    purchases: [],
    users: [],
    workshops: [],
    courses: [],
    coupons: [],
    resources: [],
    bin: []
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
  { code: "OPENZARA100", course_slug: "ai-ml", type: "flat", discount: 100, usage_limit: 0, used_count: 0, active: true, expires_at: "", updated_at: "" },
  { code: "EARLY50", course_slug: "ai-ml", type: "flat", discount: 50, usage_limit: 0, used_count: 0, active: true, expires_at: "", updated_at: "" },
  { code: "REFER100", course_slug: "ai-ml", type: "flat", discount: 100, usage_limit: 0, used_count: 0, active: true, expires_at: "", updated_at: "" },
  { code: "MANSOOR", course_slug: "ai-ml", type: "percent", discount: 100, usage_limit: 0, used_count: 0, active: true, expires_at: "", updated_at: "" }
];

const defaultResources = [
  {
    slug: "python-basics-pdf",
    title: "Python Basics PDF",
    description: "Syntax, loops, functions, lists, dictionaries and beginner practice questions.",
    price: 99,
    active: true,
    cover_image: "",
    page_images: [],
    deleted: false,
    updated_at: ""
  },
  {
    slug: "ai-ml-roadmap-pdf",
    title: "AI & ML Roadmap PDF",
    description: "Machine learning flow, tools, project ideas and interview preparation notes.",
    price: 149,
    active: true,
    cover_image: "",
    page_images: [],
    deleted: false,
    updated_at: ""
  }
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
    localKey: "openzara_admin_workshops",
    columns: ["id", "title", "host", "status", "time", "youtube_url", "google_meet_url", "updated_at", "actions"]
  },
  courses: {
    title: "Courses",
    subtitle: "Course copy, poster PNG, mentor details, pricing, and status.",
    table: "admin_courses",
    localKey: "openzara_admin_courses",
    columns: ["slug", "title", "mentor", "status", "price", "old_price", "discount", "poster", "updated_at", "actions"]
  },
  coupons: {
    title: "Coupons",
    subtitle: "Discount codes for checkout. Usage limit 0 means unlimited.",
    table: "admin_coupons",
    localKey: "openzara_admin_coupons",
    columns: ["code", "course_slug", "type", "discount", "usage_limit", "used_count", "active", "expires_at", "actions"]
  },
  resources: {
    title: "Resources",
    subtitle: "Paid PDF resources rendered as page images for view-only reading.",
    table: "admin_resources",
    localKey: "openzara_admin_resources",
    columns: ["slug", "title", "price", "active", "page_count", "updated_at", "actions"]
  },
  bin: {
    title: "Bin",
    subtitle: "Recently deleted workshops, courses, and coupons. Restore them here.",
    table: null,
    localKey: null,
    columns: ["type", "id", "title", "deleted_at", "actions"]
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
  link.download = `openzara-${state.activeView}.csv`;
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
      if (typeof resetPosterUploader === "function") resetPosterUploader();
      document.getElementById("courseStatus").textContent = "Blank course ready. Add details and save.";
    }
    if (type === "coupon") {
      document.getElementById("couponStatus").textContent = "Blank coupon ready. Add code details and save.";
    }
    if (type === "resource") {
      resetResourceUpload();
      document.getElementById("resourceStatus").textContent = "Blank resource ready. Upload a PDF and save.";
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

document.getElementById("resourceForm").addEventListener("submit", (event) => {
  event.preventDefault();
  saveManagerRecord("resources", readResourceForm(event.currentTarget), "resourceStatus", "Resource saved.");
});

document.getElementById("deleteCouponBtn").addEventListener("click", () => {
  const code = document.querySelector('#couponForm [name="code"]').value.trim().toUpperCase();
  deleteCoupon(code);
});

document.getElementById("deleteResourceBtn").addEventListener("click", () => {
  const slug = document.querySelector('#resourceForm [name="slug"]').value.trim();
  deleteResource(slug);
});

document.getElementById("deleteCourseBtn").addEventListener("click", () => {
  const slug = document.querySelector('#courseForm [name="slug"]').value.trim();
  deleteCourse(slug);
});

document.getElementById("deleteWorkshopBtn").addEventListener("click", () => {
  const id = document.querySelector('#workshopForm [name="id"]').value.trim();
  deleteWorkshop(id);
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
  resetPosterUploader();
  document.getElementById("courseStatus").textContent = "Blank course ready. Add details and save.";
});

document.querySelectorAll("[data-course-preset]").forEach((button) => {
  button.addEventListener("click", () => {
    const course = defaultCourses[button.dataset.coursePreset];
    if (course) fillCourseForm(course);
  });
});

// ---------- Course poster uploader ----------
const POSTER_BUCKET = "course-posters";
const POSTER_MAX_BYTES = 2 * 1024 * 1024; // 2 MB

const coursePosterFile = document.getElementById("coursePosterFile");
const coursePosterStatus = document.getElementById("coursePosterStatus");
const coursePosterPreview = document.getElementById("coursePosterPreview");
const coursePosterUrlField = document.querySelector('#courseForm [name="poster"]');

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

async function uploadCoursePoster(file) {
  if (!file) return null;
  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (PNG, JPG, WebP, SVG).");
  }
  if (file.size > POSTER_MAX_BYTES) {
    throw new Error(`File too large. Max ${(POSTER_MAX_BYTES / 1024 / 1024).toFixed(0)} MB.`);
  }

  const slug = cleanId(coursePosterUrlField?.form?.querySelector('[name="slug"]')?.value || "course") || "course";
  const ext = (file.name.split(".").pop() || file.type.split("/")[1] || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
  const path = `${slug}-${Date.now()}.${ext}`;

  const client = getClient();
  if (client?.storage) {
    try {
      const { error } = await client.storage.from(POSTER_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type
      });
      if (!error) {
        const { data } = client.storage.from(POSTER_BUCKET).getPublicUrl(path);
        if (data?.publicUrl) return { url: data.publicUrl, source: "supabase" };
      } else {
        console.warn("Supabase storage upload failed", error);
      }
    } catch (err) {
      console.warn("Supabase storage threw", err);
    }
  }

  // Fallback: embed as base64 data URL (works without storage bucket)
  const dataUrl = await readFileAsDataURL(file);
  return { url: dataUrl, source: "inline" };
}

function setPosterPreview(value) {
  if (!coursePosterPreview) return;
  if (value) {
    coursePosterPreview.src = value;
    coursePosterPreview.hidden = false;
  } else {
    coursePosterPreview.removeAttribute("src");
    coursePosterPreview.hidden = true;
  }
}

function resetPosterUploader() {
  if (coursePosterFile) coursePosterFile.value = "";
  if (coursePosterStatus) {
    coursePosterStatus.textContent = "";
    coursePosterStatus.className = "poster-upload-status";
  }
  setPosterPreview("");
}

if (coursePosterFile && coursePosterStatus && coursePosterUrlField) {
  coursePosterFile.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    coursePosterStatus.textContent = "Uploading...";
    coursePosterStatus.className = "poster-upload-status";

    try {
      const result = await uploadCoursePoster(file);
      if (!result) return;
      coursePosterUrlField.value = result.url;
      setPosterPreview(result.url);
      coursePosterStatus.textContent = result.source === "supabase"
        ? "Uploaded to Supabase storage."
        : "Loaded inline (no Supabase 'course-posters' bucket — image will be embedded in the course row).";
      coursePosterStatus.classList.add(result.source === "supabase" ? "is-success" : "is-error");
    } catch (err) {
      coursePosterStatus.textContent = err?.message || "Upload failed.";
      coursePosterStatus.classList.add("is-error");
    }
  });

  coursePosterUrlField.addEventListener("input", () => {
    setPosterPreview(coursePosterUrlField.value.trim());
  });
}

// ---------- PDF resource uploader ----------
const resourcePdfFile = document.getElementById("resourcePdfFile");
const resourcePdfPreview = document.getElementById("resourcePdfPreview");
const resourceCoverPreview = document.getElementById("resourceCoverPreview");
const resourcePdfPages = document.getElementById("resourcePdfPages");
const resourceStatus = document.getElementById("resourceStatus");
let pendingResourcePages = [];
let pendingResourceCover = "";

if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

async function renderPdfToImages(file) {
  if (!window.pdfjsLib) throw new Error("PDF viewer library did not load.");
  const bytes = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const targetWidth = Math.min(1200, Math.max(760, Math.round(viewport.width * 1.6)));
    const scale = targetWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });
    canvas.width = Math.floor(scaledViewport.width);
    canvas.height = Math.floor(scaledViewport.height);
    await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
    pages.push(canvas.toDataURL("image/webp", 0.86));
  }

  return pages;
}

function resetResourceUpload() {
  pendingResourcePages = [];
  pendingResourceCover = "";
  if (resourcePdfFile) resourcePdfFile.value = "";
  if (resourcePdfPreview) resourcePdfPreview.hidden = true;
  if (resourceCoverPreview) resourceCoverPreview.removeAttribute("src");
  if (resourcePdfPages) resourcePdfPages.textContent = "0 pages ready";
  if (resourceStatus) {
    resourceStatus.textContent = "";
    resourceStatus.className = "form-status";
  }
}

if (resourcePdfFile) {
  resourcePdfFile.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    resourceStatus.textContent = "Converting PDF pages to protected images...";
    resourceStatus.className = "form-status";

    try {
      pendingResourcePages = await renderPdfToImages(file);
      pendingResourceCover = pendingResourcePages[0] || "";
      if (resourceCoverPreview) resourceCoverPreview.src = pendingResourceCover;
      if (resourcePdfPreview) resourcePdfPreview.hidden = false;
      if (resourcePdfPages) resourcePdfPages.textContent = `${pendingResourcePages.length} page${pendingResourcePages.length === 1 ? "" : "s"} ready`;
      resourceStatus.textContent = "PDF converted. Save the resource to publish it.";
      resourceStatus.classList.add("is-success");
    } catch (error) {
      pendingResourcePages = [];
      pendingResourceCover = "";
      resourceStatus.textContent = error?.message || "Could not convert PDF.";
      resourceStatus.classList.add("is-error");
    }
  });
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function getClient() {
  return typeof getSupabaseClient === "function" ? getSupabaseClient() : null;
}

async function loadDashboard() {
  const client = getClient();
  loadStatus.textContent = client ? "Loading..." : "Offline (using local drafts)";

  const entries = await Promise.all(
    Object.entries(views).map(async ([key, view]) => {
      if (!view.table) return [key, state.records[key] || []];
      const fallbackRows = getFallbackRows(key);
      const localRows = readLocalRows(view.localKey);
      if (!client) {
        return [key, sortRecords(mergeRows(fallbackRows, localRows, key))];
      }
      const { data, error } = await client.from(view.table).select("*");
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

  state.records.bin = computeBinRows();

  updateMetrics();
  renderCurrentView();
  loadStatus.textContent = client ? "Updated" : "Offline (using local drafts)";
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

  const idKey = getIdKey(viewKey);
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
  if (key === "resources") return defaultResources;
  return [];
}

function getIdKey(key) {
  if (key === "courses" || key === "resources") return "slug";
  if (key === "coupons") return "code";
  return "id";
}

function mergeRows(baseRows, overrideRows, key) {
  const idKey = getIdKey(key);
  const map = new Map();
  baseRows.forEach((row) => {
    if (row && row[idKey] != null) map.set(row[idKey], row);
  });
  overrideRows.forEach((row) => {
    if (!row || row[idKey] == null) return;
    const previous = map.get(row[idKey]);
    map.set(row[idKey], previous ? { ...previous, ...row } : row);
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

  if (typeof resetPosterUploader === "function") resetPosterUploader();
  if (typeof setPosterPreview === "function") setPosterPreview((course.poster || "").trim());

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

function fillResourceForm(resource) {
  const form = document.getElementById("resourceForm");
  Object.entries(resource).forEach(([key, value]) => {
    const field = form.querySelector(`[name="${key}"]`);
    if (!field) return;
    field.value = value == null ? "" : String(value);
  });
  pendingResourcePages = Array.isArray(resource.page_images) ? resource.page_images : [];
  pendingResourceCover = resource.cover_image || pendingResourcePages[0] || "";
  if (resourceCoverPreview && pendingResourceCover) resourceCoverPreview.src = pendingResourceCover;
  if (resourcePdfPreview) resourcePdfPreview.hidden = !pendingResourceCover;
  if (resourcePdfPages) resourcePdfPages.textContent = `${pendingResourcePages.length} page${pendingResourcePages.length === 1 ? "" : "s"} ready`;

  const status = document.getElementById("resourceStatus");
  status.textContent = `${resource.title} loaded. Upload a new PDF only if you want to replace pages.`;
  status.className = "form-status is-success";
}

async function softDeleteRecord(viewKey, idKey, idValue, statusEl, label) {
  const cleanedId = String(idValue || "").trim();
  if (!cleanedId) {
    if (statusEl) {
      statusEl.textContent = `Enter ${label.toLowerCase()} to delete.`;
      statusEl.className = "form-status is-error";
    }
    return;
  }

  if (statusEl) {
    statusEl.textContent = "Deleting...";
    statusEl.className = "form-status";
  }

  const view = views[viewKey];
  const finalId = idKey === "code" ? cleanedId.toUpperCase() : cleanedId;
  const row = {
    [idKey]: finalId,
    deleted: true,
    updated_at: new Date().toISOString()
  };
  if (viewKey === "coupons") row.active = false;

  const client = getClient();
  let error = null;
  if (client) {
    const result = await client.from(view.table).upsert(row, { onConflict: idKey });
    error = result.error;
  }

  writeLocalRow(view.localKey, row, idKey);

  if (statusEl) {
    statusEl.textContent = error || !client
      ? `${label} moved to bin (local). Will sync when Supabase is reachable.`
      : `${label} moved to bin. Restore it from the Bin tab.`;
    statusEl.classList.add("is-success");
  }

  await loadDashboard();
}

async function deleteCoupon(code) {
  const status = document.getElementById("couponStatus");
  await softDeleteRecord("coupons", "code", code, status, "Coupon");
  document.getElementById("couponForm").reset();
}

async function deleteCourse(slug) {
  const status = document.getElementById("courseStatus");
  await softDeleteRecord("courses", "slug", slug, status, "Course");
  document.getElementById("courseForm").reset();
}

async function deleteWorkshop(id) {
  const status = document.getElementById("workshopStatus");
  await softDeleteRecord("workshops", "id", id, status, "Workshop");
  document.getElementById("workshopForm").reset();
}

async function deleteResource(slug) {
  const status = document.getElementById("resourceStatus");
  await softDeleteRecord("resources", "slug", slug, status, "Resource");
  document.getElementById("resourceForm").reset();
  resetResourceUpload();
}

async function restoreItem(type, idValue) {
  const map = {
    workshop: { viewKey: "workshops", idKey: "id" },
    course: { viewKey: "courses", idKey: "slug" },
    coupon: { viewKey: "coupons", idKey: "code" },
    resource: { viewKey: "resources", idKey: "slug" }
  };
  const cfg = map[type];
  if (!cfg || !idValue) return;

  const view = views[cfg.viewKey];
  const existing = (state.records[cfg.viewKey] || []).find((row) => row[cfg.idKey] === idValue);
  const base = existing ? { ...existing } : { [cfg.idKey]: idValue };
  base.deleted = false;
  base.updated_at = new Date().toISOString();
  if (cfg.viewKey === "coupons") base.active = true;

  loadStatus.textContent = "Restoring...";

  const client = getClient();
  if (client) {
    await client.from(view.table).upsert(base, { onConflict: cfg.idKey });
  }
  writeLocalRow(view.localKey, base, cfg.idKey);

  await loadDashboard();
  loadStatus.textContent = `${type.charAt(0).toUpperCase()}${type.slice(1)} restored.`;
}

async function saveManagerRecord(viewKey, record, statusId, successMessage) {
  const view = views[viewKey];
  const status = document.getElementById(statusId);
  const idKey = getIdKey(viewKey);

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

function readResourceForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const slug = cleanId(data.slug);
  const existing = state.records.resources.find((item) => item.slug === slug) || {};
  const pages = pendingResourcePages.length ? pendingResourcePages : (Array.isArray(existing.page_images) ? existing.page_images : []);
  const cover = pendingResourceCover || existing.cover_image || pages[0] || "";

  return {
    slug,
    title: clean(data.title),
    description: clean(data.description),
    price: Number(data.price || 0),
    active: data.active === "true",
    cover_image: cover,
    page_images: pages,
    page_count: pages.length,
    deleted: false
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
  const baseRows = state.activeView === "bin"
    ? computeBinRows()
    : (state.records[state.activeView] || []).filter((row) => !row?.deleted);
  if (!query) return baseRows;

  return baseRows.filter((row) => Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(query)));
}

function computeBinRows() {
  const result = [];
  const groups = [
    { type: "workshop", viewKey: "workshops", idKey: "id" },
    { type: "course", viewKey: "courses", idKey: "slug" },
    { type: "coupon", viewKey: "coupons", idKey: "code" },
    { type: "resource", viewKey: "resources", idKey: "slug" }
  ];
  groups.forEach(({ type, viewKey, idKey }) => {
    (state.records[viewKey] || []).forEach((row) => {
      if (!row?.deleted) return;
      result.push({
        type,
        id: row[idKey],
        title: row.title || row.code || row[idKey] || "",
        deleted_at: row.updated_at || ""
      });
    });
  });
  return result.sort((a, b) => {
    const ta = new Date(a.deleted_at || 0).getTime();
    const tb = new Date(b.deleted_at || 0).getTime();
    return tb - ta;
  });
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
        <button class="danger-btn" type="button" data-delete-workshop="${escapeAttr(row.id)}">Delete</button>
      </div>
    `;
  }

  if (column === "actions" && viewKey === "courses") {
    return `
      <div class="row-actions">
        <button class="ghost-btn" type="button" data-edit-course="${escapeAttr(row.slug)}">Edit</button>
        <button class="danger-btn" type="button" data-delete-course="${escapeAttr(row.slug)}">Delete</button>
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

  if (column === "actions" && viewKey === "resources") {
    return `
      <div class="row-actions">
        <button class="ghost-btn" type="button" data-edit-resource="${escapeAttr(row.slug)}">Edit</button>
        <button class="danger-btn" type="button" data-delete-resource="${escapeAttr(row.slug)}">Delete</button>
      </div>
    `;
  }

  if (column === "actions" && viewKey === "bin") {
    return `
      <div class="row-actions">
        <button class="ghost-btn" type="button" data-restore-type="${escapeAttr(row.type)}" data-restore-id="${escapeAttr(row.id)}">Restore</button>
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

  const deleteWorkshopButton = event.target.closest("[data-delete-workshop]");
  if (deleteWorkshopButton) {
    const id = deleteWorkshopButton.dataset.deleteWorkshop;
    if (id && confirm(`Move workshop "${id}" to bin? You can restore it from the Bin tab.`)) {
      deleteWorkshop(id);
    }
    return;
  }

  const editCourseButton = event.target.closest("[data-edit-course]");
  if (editCourseButton) {
    openManagerPanel("course");
    const course = state.records.courses.find((item) => item.slug === editCourseButton.dataset.editCourse);
    if (course) fillCourseForm(course);
    return;
  }

  const deleteCourseButton = event.target.closest("[data-delete-course]");
  if (deleteCourseButton) {
    const slug = deleteCourseButton.dataset.deleteCourse;
    if (slug && confirm(`Move course "${slug}" to bin? You can restore it from the Bin tab.`)) {
      deleteCourse(slug);
    }
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
    const code = deleteButton.dataset.deleteCoupon;
    if (code && confirm(`Move coupon "${code}" to bin? You can restore it from the Bin tab.`)) {
      deleteCoupon(code);
    }
    return;
  }

  const editResourceButton = event.target.closest("[data-edit-resource]");
  if (editResourceButton) {
    openManagerPanel("resource");
    const resource = state.records.resources.find((item) => item.slug === editResourceButton.dataset.editResource);
    if (resource) fillResourceForm(resource);
    return;
  }

  const deleteResourceButton = event.target.closest("[data-delete-resource]");
  if (deleteResourceButton) {
    const slug = deleteResourceButton.dataset.deleteResource;
    if (slug && confirm(`Move resource "${slug}" to bin? You can restore it from the Bin tab.`)) {
      deleteResource(slug);
    }
    return;
  }

  const restoreButton = event.target.closest("[data-restore-id]");
  if (restoreButton) {
    restoreItem(restoreButton.dataset.restoreType, restoreButton.dataset.restoreId);
  }
});

setAccess(hasAccess());
