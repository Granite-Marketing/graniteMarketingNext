import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { apiVersion, dataset, projectId, useCdn } from "./env";

// Create Sanity client (mirrors MLN/src/sanity/client.ts style)
//
// Note: `perspective` and `stega` are deliberately NOT pinned here. They are
// decided per-request in `lib/sanity/lib/fetch.ts`, which is the single place
// that knows whether Draft Mode is active. Hardcoding them here would make
// draft previews impossible.
//
// `studioUrl` is what lets stega-encoded content link back to the embedded
// Studio. It is only ever *activated* in Draft Mode.
export const client = createClient({
	apiVersion,
	dataset,
	projectId,
	useCdn,
	stega: {
		enabled: false,
		studioUrl: "/studio",
	},
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
 * @param source - Sanity image reference with asset._ref
 * @returns Image URL string, or `/placeholder.svg` as a safe fallback
 *
 * Migration note: legacy `_externalUrl` support has been removed.
 * All images should now come from Sanity or fall back to a local placeholder.
 */
export function urlFor(source: SanityImageAsset | null | undefined): string {
	// If there's no source at all, use a local placeholder so layouts stay stable
	if (!source) return "/placeholder.svg";

	try {
		const url = builder.image(source).auto("format").url();

		// In development, add hourly cache-busting to get fresh images
		// without breaking client cache behaviour.
		if (process.env.NODE_ENV === "development") {
			const hourly = Math.floor(Date.now() / (1000 * 60 * 60));
			return `${url}${url.includes("?") ? "&" : "?"}v=${hourly}`;
		}

		return url;
	} catch {
		// If anything goes wrong building the URL, fall back to a safe placeholder
		return "/placeholder.svg";
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
