// Central API config — all components import from here
// In dev: uses Vite proxy (localhost:5000 via vite.config.js)
// In production: uses VITE_API_URL set in Vercel dashboard
export const API_BASE = import.meta.env.VITE_API_URL || "";
export const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
