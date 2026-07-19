import { sectionIdProps } from "@/lib/utils/section-id";
import Link from "next/link";
import { CalButton } from "./cal-button";

type SecondaryCta = { label: string; href: string } | null;

type RelayCTAProps = {
	heading?: string;
	subtitle?: string;
	/** Optional Sanity-driven overrides (U13 of the page builder plan) — each
	 * falls back to the original hardcoded copy so existing callers render
	 * byte-identically when omitted. */
	primaryCtaLabel?: string;
	secondaryCta?: SecondaryCta;
	footnote?: string;
	/** `undefined`/`null` both omit the attribute — see the block adapter's
	 * anchorId handling for why a section with no anchor must render no
	 * `id` at all rather than `id=""`. */
	id?: string | null;
	/** The U13 item-level `data-sanity` attribute for this section. */
	dataSanity?: string;
};

export function RelayCTA({
	heading = "Stop doing work a workflow could do.",
	subtitle = "Thirty minutes, no slides. We map one of your real workflows live on the call. You keep the map either way.",
	primaryCtaLabel = "Book an intro call",
	secondaryCta = { label: "or send us a message", href: "/contact" },
	footnote = "avg. response time: same day · first build live in ~3 weeks",
	id,
	dataSanity,
}: RelayCTAProps) {
	return (
		<section
			{...sectionIdProps(id, "contact")}
			{...(dataSanity ? { "data-sanity": dataSanity } : {})}
			aria-labelledby="cta-heading"
			className="scroll-mt-16 border-t border-relay-line"
		>
			<div className="mx-auto container px-6 py-24">
				<div className="relative overflow-hidden rounded-xl border border-relay-line bg-relay-panel">
					<p className="flex items-center justify-between border-b border-relay-line px-5 py-3 font-mono text-xs text-relay-faint">
						<span>intro-call.n8n</span>
						<span className="flex items-center gap-2 text-relay-cyan">
							<span
								aria-hidden="true"
								className="size-1.5 animate-relay-blink rounded-full bg-relay-cyan"
							/>
							trigger: you
						</span>
					</p>

					<div
						aria-hidden="true"
						className="pointer-events-none absolute -bottom-56 left-1/2 h-96 w-[40rem] -translate-x-1/2 animate-relay-breathe rounded-full bg-[radial-gradient(closest-side,rgba(63,198,220,0.14),transparent_72%)]"
					/>

					<div className="relative mx-auto max-w-2xl px-6 py-18 text-center sm:py-20">
						<h2
							id="cta-heading"
							className="text-balance text-3xl font-semibold tracking-tight text-relay-ink sm:text-4xl"
						>
							{heading}
						</h2>
						<p className="mx-auto mt-5 max-w-md text-pretty leading-relaxed text-relay-body">
							{subtitle}
						</p>
						<div className="mt-9 flex flex-wrap items-center justify-center gap-5">
							<CalButton size="lg">{primaryCtaLabel}</CalButton>
							{secondaryCta && (
								<Link
									href={secondaryCta.href}
									className="rounded border border-relay-line px-5 py-3 font-mono text-[13px] text-relay-faint transition-colors hover:border-relay-cyan hover:text-relay-ink"
								>
									{secondaryCta.label}
								</Link>
							)}
						</div>
						{footnote && (
							<p className="mt-8 font-mono text-[11px] text-relay-faint">
								{footnote}
							</p>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
