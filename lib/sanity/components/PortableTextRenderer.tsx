import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import { urlForImage } from "../client";

interface PortableTextRendererProps {
	value: PortableTextBlock[];
}

const components: PortableTextComponents = {
	block: {
		h1: ({ children }) => (
			<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
				{children}
			</h1>
		),
		h2: ({ children }) => (
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-4 mt-8">
				{children}
			</h2>
		),
		h3: ({ children }) => (
			<h3 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-3 mt-6">
				{children}
			</h3>
		),
		normal: ({ children }) => (
			<p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>
		),
		blockquote: ({ children }) => (
			<blockquote className="border-l-4 border-primary/60 pl-4 italic my-6 text-muted-foreground">
				{children}
			</blockquote>
		),
	},
	list: {
		bullet: ({ children }) => (
			<ul className="mb-6 ml-6 list-disc space-y-2 text-muted-foreground">
				{children}
			</ul>
		),
		number: ({ children }) => (
			<ol className="mb-6 ml-6 list-decimal space-y-2 text-muted-foreground">
				{children}
			</ol>
		),
	},
	listItem: {
		bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
		number: ({ children }) => <li className="leading-relaxed">{children}</li>,
	},
	marks: {
		strong: ({ children }) => (
			<strong className="font-semibold text-foreground">{children}</strong>
		),
		em: ({ children }) => (
			<em className="italic text-foreground">{children}</em>
		),
		link: ({ children, value }) => {
			const href = (value as any)?.href || "";
			const isExternal = href.startsWith("http");
			return (
				<a
					href={href}
					className="text-primary underline-offset-2 hover:underline"
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
	},
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
	if (!value || value.length === 0) return null;

	return (
		<div className="prose prose-neutral dark:prose-invert max-w-none">
			<PortableText value={value} components={components} />
		</div>
	);
}
