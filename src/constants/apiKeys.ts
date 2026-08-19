/**
 * Centralized API Key Pool & Rotation System
 * Supports server-side (process.env) and client-side (Vite / LocalStorage / Fallback Pool)
 */

export const DEFAULT_KEY_POOL: string[] = [
  // Any keys passed via build or defaults will be stored and rotated here
];

export function getCleanKeyArray(rawKeyInput?: string): string[] {
  if (!rawKeyInput || typeof rawKeyInput !== "string") return [];
  return rawKeyInput
    .split(/[,\n]/)
    .map((k) => k.trim().replace(/^["']|["']$/g, ""))
    .filter((k) => k.length > 10);
}
