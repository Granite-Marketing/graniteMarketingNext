// Centralised Sanity environment configuration
// Mirrors the pattern used in MLN/src/sanity/env.ts

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

// Allow sensible defaults so scripts (which may not load .env.local) still work,
// while the Next.js app can override via env vars.
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "0p8nq3lx";

// For marketing sites we usually want fresh content; keep CDN off by default
export const useCdn = false;


