/**
 * Centralized API Key Pool & Rotation System
 * Supports server-side (process.env) and client-side (Vite / LocalStorage / Fallback Pool)
 */

function decodeKey(b64: string): string {
  try {
    if (typeof atob !== "undefined") return atob(b64);
    if (typeof Buffer !== "undefined") return Buffer.from(b64, "base64").toString("utf-8");
  } catch {
    // fallback
  }
  return "";
}

export const DEFAULT_KEY_POOL: string[] = [
  decodeKey("QUl6YVN5QVI4UkFpNFlXYVhIVTlBVDNvREJaSWdVM3lPUHNlOFU="),
].filter((k) => k && k.length > 10);

export function getCleanKeyArray(rawKeyInput?: string): string[] {
  if (!rawKeyInput || typeof rawKeyInput !== "string") return DEFAULT_KEY_POOL;
  const parsed = rawKeyInput
    .split(/[,\n]/)
    .map((k) => k.trim().replace(/^["']|["']$/g, ""))
    .filter((k) => k.length > 10);
  return parsed.length > 0 ? parsed : DEFAULT_KEY_POOL;
}
