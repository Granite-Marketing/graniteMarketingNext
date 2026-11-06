"use client";

import { useRef, useState, type ReactNode } from "react";
import { stegaClean } from "@sanity/client/stega";

export function InlineCode({ children }: { children: ReactNode }) {
	const [copied, setCopied] = useState(false);
	const codeRef = useRef<HTMLElement>(null);

	const handleCopy = async () => {
		const text = codeRef.current?.textContent ?? "";
		try {
			// stegaClean: in Draft Mode the text carries invisible stega characters.
			await navigator.clipboard.writeText(stegaClean(text) ?? text);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			// Clipboard API unavailable (non-HTTPS, permission denied, etc.)
		}
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			title="Click to copy"
			className="relative inline cursor-pointer rounded-md border border-border bg-muted px-1.5 py-0.5 text-left box-decoration-clone transition-colors hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-primary"
		>
			{/* granite-convention-exception: tailwind-bracket-values
			    reason: em-relative size keeps code in step with headings and body; no utility equivalent */}
			<code ref={codeRef} className="font-mono text-[0.9em] break-words text-foreground">
				{children}
			</code>
			<span
				aria-live="polite"
				className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-foreground px-2 py-0.5 font-sans text-xs whitespace-nowrap text-background transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}
			>
				{copied ? "Copied" : ""}
			</span>
		</button>
	);
}
