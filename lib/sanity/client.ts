import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

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
const builder = imageUrlBuilder(client);

/**
 * Generate image URL from Sanity image source
 * @param source - Sanity image reference
 * @returns Image URL builder for chaining (e.g., .width(800).url())
 */
export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Simple helper to get image URL directly
 * @param source - Sanity image reference or object with asset._ref
 * @returns Image URL string
 */
export function urlFor(source: SanityImageSource | { asset?: { _ref?: string } }): string {
  if (!source) return "";
  
  // Handle external URLs (from migration)
  if (typeof source === "object" && "_externalUrl" in source) {
    return (source as { _externalUrl: string })._externalUrl;
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
