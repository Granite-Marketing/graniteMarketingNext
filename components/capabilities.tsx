import { sectionIdProps } from "@/lib/utils/section-id";
import { capabilities as defaultCapabilities, type Capability } from "./data";

type CapabilityFooterLink = { label: string; href: string } | null;

type RelayCapabilitiesProps = {
	/** Optional Sanity-driven overrides (U13 of the page builder plan) — each
	 * falls back to the original hardcoded copy so existing callers (the
	 * still-unmigrated homepage) render byte-identically when omitted. */
	eyebrow?: string;
	heading?: string;
	body?: string;
	items?: (Capability & { _key?: string })[];
	link?: CapabilityFooterLink;
	/** `undefined`/`null` both omit the attribute — see the block adapter's
	 * anchorId handling for why a section with no anchor must render no
	 * `id` at all rather than `id=""`. */
	id?: string | null;
	/** The U13 item-level `data-sanity` attribute for this section. */
	dataSanity?: string;
};

export function RelayCapabilities({
	eyebrow = "// capabilities",
	heading = "Built for the work you're tired of doing.",
	body = "Six systems, each scoped to a job your team currently does by hand. Start with one. They're designed to be wired together.",
	items = defaultCapabilities,
	link = { label: "Map your first automation →", href: "#contact" },
	id,
	dataSanity,
}: RelayCapabilitiesProps) {
	return (
		<section
			{...sectionIdProps(id, "services")}
			{...(dataSanity ? { "data-sanity": dataSanity } : {})}
			aria-labelledby="capabilities-heading"
			className="scroll-mt-16 border-t border-relay-line"
		>
			<div className="mx-auto container px-6 py-24">
				<header className="max-w-2xl">
					<p className="mb-4 font-mono text-[13px] text-relay-cyan">
						{eyebrow}
					</p>
					<h2
						id="capabilities-heading"
						className="text-balance text-3xl font-semibold tracking-tight text-relay-ink sm:text-4xl"
					>
						{heading}
					</h2>
					<p className="mt-4 max-w-xl text-pretty text-relay-faint">
						{body}
					</p>
				</header>

				<ul className="mt-13 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-12">
					{items.map((cap) => (
						<li
							key={cap._key ?? cap.tag}
							className={
								cap.featured
									? "sm:col-span-2 lg:col-span-6"
									: "sm:col-span-1 lg:col-span-3"
							}
						>
							<article
								className={`flex h-full flex-col gap-2.5 rounded-lg border border-relay-line bg-relay-panel p-6 transition-colors hover:border-relay-cyan hover:bg-relay-raised ${cap.featured ? "min-h-[230px]" : ""}`}
							>
								<p className="font-mono text-[10px] uppercase tracking-[0.16em] text-relay-cyan">
									{cap.tag}
								</p>
								<h3 className="text-lg font-semibold tracking-tight text-relay-ink">
									{cap.title}
								</h3>
								<p className="text-sm leading-relaxed text-relay-faint">
									{cap.description}
								</p>
								{cap.snippet && (
									<ul
										aria-hidden="true"
										className="mt-auto rounded-md border border-relay-line bg-relay-bg px-4 py-3 font-mono text-xs leading-7 text-relay-body"
									>
										{cap.snippet.map((line) => (
											<li key={line}>
												<span className="text-relay-cyan">→ </span>
												{line}
											</li>
										))}
									</ul>
								)}
							</article>
						</li>
					))}
				</ul>

				{link && (
					<p className="mt-11">
						<a
							href={link.href}
							className="border-b border-relay-cyan/30 pb-1 font-mono text-[13px] text-relay-cyan transition-colors hover:border-relay-cyan"
						>
							{link.label}
						</a>
					</p>
				)}
			</div>
		</section>
	);
}
