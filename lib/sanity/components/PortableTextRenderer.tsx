import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import { urlForImage } from "../client";
import { codeToHtml } from "shiki";
import { CodeBlock } from "./CodeBlock";

interface PortableTextRendererProps {
	value: PortableTextBlock[];
}

const LANG_ALIASES: Record<string, string> = {
	golang: "go",
	batchfile: "bat",
	mysql: "sql",
	groq: "text",
};

async function HighlightedCode({
	value,
}: {
	value: { code: string; language?: string; filename?: string };
}) {
	if (!value.code) return null;

	const lang = LANG_ALIASES[value.language ?? ""] ?? value.language ?? "text";
	let html: string;
	try {
		html = await codeToHtml(value.code, { lang, theme: "github-dark" });
	} catch {
		html = await codeToHtml(value.code, { lang: "text", theme: "github-dark" });
	}

	return (
		<CodeBlock
			html={html}
			language={value.language}
			filename={value.filename}
			code={value.code}
		/>
	);
}

const components: PortableTextComponents = {
	marks: {
		link: ({ children, value }) => {
			const href = (value as any)?.href || "";
			const isExternal = href.startsWith("http");
			return (
				<a
					href={href}
					target={isExternal ? "_blank" : undefined}
					rel={isExternal ? "noopener noreferrer" : undefined}
				>
					{children}
				</a>
			);
		},
	},
	types: {
		image: ({ value }: { value: any }) => {
			if (!value?.asset) return null;

			const imageUrl = urlForImage(value.asset).url();
			const aspectRatio = value.aspectRatio || "16/9";

			let aspectRatioStyle: React.CSSProperties = {};

			if (aspectRatio === "original" && value.asset?._ref) {
				const ref = value.asset._ref;
				const dimensions = ref.split("-")[2];
				if (dimensions) {
					const [width, height] = dimensions.split("x").map(Number);
					if (width && height) {
						aspectRatioStyle = { aspectRatio: `${width} / ${height}` };
					}
				}
			} else {
				aspectRatioStyle = { aspectRatio };
			}

			return (
				<figure className="my-8">
					<div
						className="relative w-full overflow-hidden rounded-xl bg-muted"
						style={aspectRatioStyle}
					>
						<Image
							src={imageUrl}
							alt={value.alt || "Image"}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-cover"
						/>
					</div>
					{value.caption && (
						<figcaption className="mt-2 text-sm text-center text-muted-foreground italic">
							{value.caption}
						</figcaption>
					)}
				</figure>
			);
		},
		code: ({ value }: { value: { code: string; language?: string; filename?: string } }) => {
			return <HighlightedCode value={value} />;
		},
	},
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
	if (!value || value.length === 0) return null;

	return (
		<div className="typo">
			<PortableText value={value} components={components} />
		</div>
	);
}
