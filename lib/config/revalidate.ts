/**
 * Revalidation configuration for Next.js ISR (Incremental Static Regeneration)
 * 
 * In development: All revalidation is disabled (0) for immediate updates
 * In production: Uses configured intervals for optimal caching
 */

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Homepage revalidation (30 minutes in production)
 */
export const HOME_REVALIDATE = isDevelopment ? 0 : 1800;

/**
 * Blog listing page revalidation (1 hour in production)
 */
export const BLOG_REVALIDATE = isDevelopment ? 0 : 3600;

/**
 * Individual blog post revalidation (1 hour in production)
 */
export const BLOG_POST_REVALIDATE = isDevelopment ? 0 : 3600;

/**
 * Static pages that never need revalidation
 * (contact, privacy, cookies, etc.)
 */
export const STATIC_REVALIDATE = false;

/**
 * Default revalidation for general pages (1 hour in production)
 */
export const DEFAULT_REVALIDATE = isDevelopment ? 0 : 3600;
