/** Ensures API calls use /api prefix on the backend (e.g. http://localhost:8000 → http://localhost:8000/api). */
export function normalizeApiBase(raw) {
  const base = (raw || "/api").trim().replace(/\/$/, "");
  if (!base || base === "/api") return "/api";
  if (base.endsWith("/api")) return base;
  return `${base}/api`;
}
