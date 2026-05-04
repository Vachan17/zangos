// Central API config — all components import from here.
//
// Dev: leave VITE_API_URL unset; Vite proxies /api and /socket.io to the local backend.
//
// Production:
// - Same host as API (e.g. one Render Web Service serving dist + Express): leave VITE_API_URL unset.
// - Split deploy (e.g. static on Vercel, API elsewhere): set VITE_API_URL to the API origin (https, no trailing slash).
const envApi = import.meta.env.VITE_API_URL || "";

export const API_BASE = envApi;

// socket.io-client: undefined = same origin as the page (dev + Vite WS proxy). Never fall back to localhost in prod builds.
export const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:5000"
    : undefined);
