import { sectionIdProps } from "@/lib/utils/section-id";
import type { CaseStudyCard } from "@/lib/sanity/lib/adapters";
import { CaseStudySlider } from "./case-study-slider";
import { resultStats } from "./data";

export type ResultStat = {
	_key?: string;
	value: string;
	suffix?: string;
	label: string;
};

type RelayResultsProps = {
	caseStudies: CaseStudyCard[];
	/** Optional Sanity-driven overrides (U13 of the page builder plan) — each
	 * falls back to the original hardcoded copy so existing callers render
	 * byte-identically when omitted. */
	eyebrow?: string;
	heading?: string;
	stats?: ResultStat[];
	/** `undefined`/`null` both omit the attribute — see the block adapter's
	 * anchorId handling for why a section with no anchor must render no
	 * `id` at all rather than `id=""`. */
	id?: string | null;
	/** The U13 item-level `data-sanity` attribute for this section. */
	dataSanity?: string;
};

export function RelayResults({
	caseStudies,
	eyebrow = "// results",
	heading = "Measured in hours back, not features shipped.",
	stats = resultStats,
	id,
	dataSanity,
}: RelayResultsProps) {
	return (
		<section
			{...sectionIdProps(id, "results")}
			{...(dataSanity ? { "data-sanity": dataSanity } : {})}
			aria-labelledby="results-heading"
			className="scroll-mt-16 border-t border-relay-line"
		>
			<div className="mx-auto container px-6 py-24">
				<header className="max-w-2xl">
					<p className="mb-4 font-mono text-[13px] text-relay-cyan">
						{eyebrow}
					</p>
					<h2
						id="results-heading"
						className="text-balance text-3xl font-semibold tracking-tight text-relay-ink sm:text-4xl"
					>
						{heading}
					</h2>
				</header>

				<dl className="mt-13 grid gap-3.5 sm:grid-cols-3">
					{stats.map((stat) => (
						<div
							key={stat._key ?? stat.label}
							className="flex flex-col-reverse gap-2.5 rounded-lg border border-relay-line bg-relay-panel px-6 py-5"
						>
							<dt className="font-mono text-[11px] leading-relaxed text-relay-faint">
								{stat.label}
							</dt>
							<dd className="text-4xl font-semibold tabular-nums tracking-tight text-relay-ink">
								{stat.value}
								{stat.suffix && (
									<span className="text-relay-cyan">{stat.suffix}</span>
								)}
							</dd>
						</div>
					))}
				</dl>

				<CaseStudySlider caseStudies={caseStudies} />
			</div>
		</section>
	);
}
