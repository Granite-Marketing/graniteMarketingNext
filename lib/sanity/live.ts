import "server-only";

import { defineLive } from "next-sanity/live";
import { client } from "./client";

/**
 * Live Content API wiring for Draft Mode previews.
 *
 * `serverToken` is used for server-side draft reads. `browserToken` is genuinely
 * shipped to the browser when Draft Mode is active — it is what holds the live
 * connection open so the Presentation tool updates as you type.
 *
 * Because that token reaches the client, SANITY_API_READ_TOKEN must be a
 * **Viewer** (read-only) token. An Editor token here would hand write access to
 * anyone who can read a network tab on a preview session.
 */
const token = process.env.SANITY_API_READ_TOKEN;

/**
 * Whether draft previews are available in this environment.
 *
 * Deliberately NOT a module-load throw. A missing token must degrade to
 * "previews unavailable", never to "the whole site is down" — this module is
 * imported by the shared fetch layer that every published page depends on.
 */
export const hasReadToken = Boolean(token);

export const { sanityFetch, SanityLive } = defineLive({
	client,
	serverToken: token,
	// Deliberately NOT passed to the browser.
	//
	// Inside the Presentation tool the Studio pushes edits into the preview over
	// comlink, so live editing is unaffected. The only thing lost is auto-refresh
	// for a preview link opened standalone, outside the Studio.
	//
	// The trade is worth it: a browser-shipped token can read every draft and
	// mint unlimited preview links, and that access survives cookie expiry and
	// redeploys — revocable only by rotating the token.
	browserToken: false,
});
