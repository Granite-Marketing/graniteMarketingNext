import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

// Sanity configuration
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "0p8nq3lx";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

// Create Sanity client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

// Image URL builder
const builder = createImageUrlBuilder({ projectId, dataset });

// Type for image source (compatible with Sanity image references)
interface SanityImageAsset {
  _ref?: string;
  _type?: string;
  asset?: {
    _ref?: string;
    _type?: string;
  };
}

/**
 * Generate image URL from Sanity image source
 * @param source - Sanity image reference
 * @returns Image URL builder for chaining (e.g., .width(800).url())
 */
export function urlForImage(source: SanityImageAsset) {
  return builder.image(source);
}

/**
 * Simple helper to get image URL directly
 * @param source - Sanity image reference or object with asset._ref
 * @returns Image URL string
 */
export function urlFor(source: SanityImageAsset | { _externalUrl?: string } | null | undefined): string {
  if (!source) return "";
  
  // Handle external URLs (from migration)
  if ("_externalUrl" in source && source._externalUrl) {
    return source._externalUrl;
  }
  
  try {
    return builder.image(source).auto("format").url();
  } catch {
    return "";
  }
}

// Export types
export type SanityDocument = {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
};
