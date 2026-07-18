import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Disables Draft Mode and returns to the published site.
 *
 * Hand-rolled deliberately: next-sanity ships no `defineDisableDraftMode`
 * helper, and `previewUrl.previewMode.disable` is marked deprecated /
 * not-implemented in the installed Sanity types.
 */
export async function GET() {
	(await draftMode()).disable();

	// Built from the configured site URL rather than request.url, which is
	// derived from the Host header and would be a reflected open redirect
	// behind any proxy that forwards Host unvalidated.
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

	return NextResponse.redirect(new URL("/", siteUrl));
}
