/**
 * Centralized API Key Pool & Rotation System
 * Supports server-side (process.env) and client-side (Vite / LocalStorage / Fallback Pool)
 */

export const DEFAULT_KEY_POOL: string[] = [];

export function getCleanKeyArray(rawKeyInput?: string): string[] {
  if (!rawKeyInput || typeof rawKeyInput !== "string") return DEFAULT_KEY_POOL;
  const parsed = rawKeyInput
    .split(/[,\n]/)
    .map((k) => k.trim().replace(/^["']|["']$/g, ""))
    .filter((k) => k.length > 10);
  return parsed.length > 0 ? parsed : DEFAULT_KEY_POOL;
}
