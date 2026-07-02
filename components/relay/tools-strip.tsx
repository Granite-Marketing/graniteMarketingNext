import { urlForImage } from "@/lib/sanity/client";
import { ToolWire, type WireTool } from "./tool-wire";

type Tool = {
	_id: string;
	name: string;
	logo?: {
		asset: unknown;
		alt?: string;
	};
};

type RelayToolsStripProps = {
	tools: Tool[];
};

/**
 * The toolkit section, restyled as an n8n execution trace: a fixed
 * wire of tool nodes where names swap in and out at random, instead
 * of an infinite logo marquee.
 */
export function RelayToolsStrip({ tools }: RelayToolsStripProps) {
	if (!tools || tools.length === 0) return null;

	const wireTools: WireTool[] = tools.map((tool) => ({
		id: tool._id,
		name: tool.name,
		logoUrl: tool.logo?.asset
			? urlForImage(tool.logo.asset as never)
					.width(48)
					.height(48)
					.url()
			: null,
	}));

	return (
		<section
			aria-labelledby="toolkit-heading"
			className="border-t border-relay-line"
		>
			<div className="mx-auto container px-6 py-24">
				<header className="max-w-2xl">
					<p className="mb-4 font-mono text-[13px] text-relay-cyan">
						{"// toolkit"}
					</p>
					<h2
						id="toolkit-heading"
						className="text-balance text-3xl font-semibold tracking-tight text-relay-ink sm:text-4xl"
					>
						Built with industry-leading tools
					</h2>
					<p className="mt-4 max-w-xl text-pretty text-relay-faint">
						We leverage the best automation and development platforms to
						deliver powerful solutions.
					</p>
				</header>

				<div className="mt-14">
					<ToolWire tools={wireTools} />
				</div>
			</div>
		</section>
	);
}
