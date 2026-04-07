const rawBackendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

export const API_BASE_URL = rawBackendUrl.replace(/\/+$/, "");

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
