"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

/**
 * Escape hatch out of Draft Mode.
 *
 * Hidden inside the Presentation tool, where the Studio already owns the
 * preview lifecycle and the button would be redundant. It matters most when
 * Draft Mode has been reached by a shared preview link, where it is the only
 * way back to published content.
 */
export function DisableDraftMode() {
	const isPresentationTool = useIsPresentationTool();

	// `null` means "still checking" — it is the server snapshot, and the comlink
	// handshake can take up to 3s to resolve. Rendering on null would flash a
	// stray button over the Presentation iframe, which is the exact thing this
	// component exists to avoid. Only render once we know we are standalone.
	if (isPresentationTool !== false) return null;

	return (
		<a
			href="/api/draft-mode/disable"
			className="fixed bottom-4 right-4 z-50 rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-lg transition hover:bg-neutral-200"
		>
			Exit preview
		</a>
	);
}
