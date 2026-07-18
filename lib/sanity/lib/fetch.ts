import { draftMode } from "next/headers";
import { client } from "../client";
import { hasReadToken, sanityFetch } from "../live";

type FetchOptions = {
	revalidateSeconds?: number;
	/**
	 * Force the published perspective regardless of Draft Mode.
	 *
	 * Required for `generateStaticParams`, which must never emit routes for
	 * draft-only documents (and, once stega is enabled, must never let
	 * zero-width characters leak into URL segments).
	 */
	forcePublished?: boolean;
};

// Detect environment - development has no caching for immediate updates
const isDevelopment = process.env.NODE_ENV === "development";
const defaultRevalidate = isDevelopment ? 0 : 3600;

/**
 * Stega encoding powers click-to-edit overlays. It is opt-in via env flag so the
 * overlay experience can be evaluated without re-architecting anything, and so
 * it can be switched straight back off if it causes trouble.
 *
 * Stega only ever activates in Draft Mode, never for anonymous visitors.
 */
const overlaysEnabled = process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING === "true";

/**
 * Resolve Draft Mode.
 *
 * `draftMode()` does NOT throw during static generation — Next returns a
 * disabled instance for every prerender store type, and only `.enable()` /
 * `.disable()` opt a route into dynamic rendering. Verified against
 * next@16.0.10 `dist/server/request/draft-mode.js`.
 *
 * The one case that does throw is `fetchQuery` being called with no request or
 * prerender context at all — a script, a module-init side effect. That is a
 * real misconfiguration, so it is logged rather than silently swallowed.
 * Falling back to published is still the correct failure direction.
 */
async function isDraftModeEnabled(): Promise<boolean> {
	try {
		return (await draftMode()).isEnabled;
	} catch (error) {
		console.warn(
			"[sanity] draftMode() unavailable — fetchQuery was likely called " +
				"outside a request context. Serving published content.",
			error
		);
		return false;
	}
}

/**
 * The single fetch chokepoint for every Sanity query in the app.
 *
 * Published traffic keeps the exact ISR behaviour it had before Draft Mode
 * existed. Only requests carrying a valid draft cookie take the live path.
 */
export async function fetchQuery<T>(
	query: string,
	params: Record<string, any> = {},
	options: FetchOptions = {}
): Promise<T> {
	const wantsDrafts = options.forcePublished
		? false
		: await isDraftModeEnabled();

	// Degrade to published rather than throwing. Losing the token should cost
	// you previews, not the site.
	if (wantsDrafts && !hasReadToken) {
		console.warn(
			"[sanity] Draft Mode is active but SANITY_API_READ_TOKEN is not set — " +
				"serving published content instead."
		);
	}

	const useDrafts = wantsDrafts && hasReadToken;

	if (useDrafts) {
		// Live Content API: streams updates into the Presentation tool as the
		// document is edited, without a publish or a redeploy.
		//
		// `perspective` is deliberately omitted so next-sanity resolves it from
		// the `sanity-preview-perspective` cookie (falling back to drafts).
		// Pinning it here would silently ignore the Studio's own
		// Drafts/Published switcher.
		const { data } = await sanityFetch({
			query,
			params,
			stega: overlaysEnabled,
		});

		return data as T;
	}

	// Published path — unchanged from the pre-Draft-Mode implementation.
	const revalidate = options.revalidateSeconds ?? defaultRevalidate;

	return client.fetch<T>(query, params, {
		perspective: "published",
		stega: false,
		next: { revalidate },
	});
}
