// Cookie utility for Openzara — faster load of login & course data
const OZCookie = {
  set(name, value, days = 30) {
    const d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    const val = typeof value === "object" ? JSON.stringify(value) : value;
    document.cookie = `${name}=${encodeURIComponent(val)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  },

  get(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    if (!match) return null;
    const raw = decodeURIComponent(match[1]);
    try { return JSON.parse(raw); } catch { return raw; }
  },

  remove(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  },

  // Save user login details for instant dashboard load
  saveUser(user) {
    if (!user) return;
    this.set("oz_user", { name: user.name, email: user.email, phone: user.phone, clerkId: user.clerkId });
  },

  getUser() {
    return this.get("oz_user");
  },

  // Save course config for instant course page render
  saveCourseConfig(courses) {
    if (!courses) return;
    this.set("oz_courses", courses, 1); // 1 day cache
  },

  getCourseConfig() {
    return this.get("oz_courses");
  },

  // Save purchases for instant dashboard
  savePurchases(purchases) {
    if (!purchases) return;
    this.set("oz_purchases", purchases, 7);
  },

  getPurchases() {
    return this.get("oz_purchases");
  },

  // Clear all on logout
  clearAll() {
    this.remove("oz_user");
    this.remove("oz_courses");
    this.remove("oz_purchases");
  }
};
