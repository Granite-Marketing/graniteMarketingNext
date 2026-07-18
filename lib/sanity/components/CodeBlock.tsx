"use client";

import { useState } from "react";
// Imported from @sanity/client/stega rather than next-sanity: this is a client
// component, and the narrower entry point avoids pulling server-only code in.
import { stegaClean } from "@sanity/client/stega";

interface CodeBlockProps {
	html: string;
	language?: string;
	filename?: string;
	code: string;
}

export function CodeBlock({ html, language, filename, code }: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			// stegaClean before copying. In Draft Mode the code string carries
			// invisible stega characters, which would be pasted into the editor's
			// terminal or IDE and silently break whatever they land in.
			await navigator.clipboard.writeText(stegaClean(code) ?? code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard API unavailable (non-HTTPS, permission denied, etc.)
		}
	};

	return (
		<div className="group relative my-8 rounded-xl border border-border bg-zinc-950 overflow-hidden">
			<div className="flex items-center justify-between px-4 py-2 border-b border-border bg-zinc-900/50">
				<span className="text-xs text-muted-foreground font-mono">
					{filename || language || "code"}
				</span>
				<button
					type="button"
					onClick={handleCopy}
					aria-label={copied ? "Copied" : "Copy code"}
					className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-zinc-800"
				>
					{copied ? "Copied!" : "Copy"}
				</button>
			</div>
			<div
				className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!text-sm"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
