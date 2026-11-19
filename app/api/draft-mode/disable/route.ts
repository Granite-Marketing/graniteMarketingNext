import { SeverityNumber } from "@opentelemetry/api-logs";
import { after } from "next/server";
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { loggerProvider, posthogLogger } from "@/instrumentation";

export const runtime = "nodejs";

/**
 * Disables Draft Mode and returns to the published site.
 *
 * Hand-rolled deliberately: next-sanity ships no `defineDisableDraftMode`
 * helper, and `previewUrl.previewMode.disable` is marked deprecated /
 * not-implemented in the installed Sanity types.
 */
export async function GET() {
	posthogLogger?.emit({
		body: "Draft Mode disable requested",
		severityNumber: SeverityNumber.INFO,
		attributes: { route: "/api/draft-mode/disable", action: "disable_requested" },
	});

	(await draftMode()).disable();

	posthogLogger?.emit({
		body: "Draft Mode disabled",
		severityNumber: SeverityNumber.INFO,
		attributes: { route: "/api/draft-mode/disable", action: "disabled" },
	});

	after(async () => {
		if (loggerProvider) {
			await loggerProvider.forceFlush().catch(() => {});
		}
	});

	// Built from the configured site URL rather than request.url, which is
	// derived from the Host header and would be a reflected open redirect
	// behind any proxy that forwards Host unvalidated.
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

	return NextResponse.redirect(new URL("/", siteUrl));
}
