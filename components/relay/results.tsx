import type { CaseStudyCard } from "@/lib/sanity/lib/adapters";
import { CaseStudySlider } from "./case-study-slider";
import { resultStats } from "./data";

type RelayResultsProps = {
	caseStudies: CaseStudyCard[];
};

export function RelayResults({ caseStudies }: RelayResultsProps) {
	return (
		<section
			id="results"
			aria-labelledby="results-heading"
			className="scroll-mt-16 border-t border-relay-line"
		>
			<div className="mx-auto container px-6 py-24">
				<header className="max-w-2xl">
					<p className="mb-4 font-mono text-[13px] text-relay-cyan">
						{"// results"}
					</p>
					<h2
						id="results-heading"
						className="text-balance text-3xl font-semibold tracking-tight text-relay-ink sm:text-4xl"
					>
						Measured in hours back, not features shipped.
					</h2>
				</header>

				<dl className="mt-13 grid gap-3.5 sm:grid-cols-3">
					{resultStats.map((stat) => (
						<div
							key={stat.label}
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
