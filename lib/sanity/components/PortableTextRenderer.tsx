import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import { urlForImage } from "../client";

interface PortableTextRendererProps {
	value: PortableTextBlock[];
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
