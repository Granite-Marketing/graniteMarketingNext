import { sectionIdProps } from "@/lib/utils/section-id";
import { processSteps } from "./data";

export type ProcessStep = {
	_key?: string;
	/** The small mono index, e.g. "01 / map" — `stepLabel` on the Sanity
	 * schema (lib/sanity/studio-schemas/blocks/processBlock.ts), renamed
	 * from data.ts's `index` field only at this boundary. */
	stepLabel: string;
	title: string;
	description: string;
	duration: string;
};

const DEFAULT_STEPS: ProcessStep[] = processSteps.map((step) => ({
	stepLabel: step.index,
	title: step.title,
	description: step.description,
	duration: step.duration,
}));

type ProcessProps = {
	/** Optional Sanity-driven overrides (U13 of the page builder plan) — each
	 * falls back to the original hardcoded copy so existing callers (the
	 * still-unmigrated homepage) render byte-identically when omitted. */
	eyebrow?: string;
	heading?: string;
	body?: string;
	steps?: ProcessStep[];
	footnote?: string;
	/** `undefined`/`null` both omit the attribute — see the block adapter's
	 * anchorId handling for why a section with no anchor must render no
	 * `id` at all rather than `id=""`. */
	id?: string | null;
	/** The U13 item-level `data-sanity` attribute for this section. */
	dataSanity?: string;
};

export function Process({
	eyebrow = "// how we ship",
	heading = "From first call to running in production.",
	body = "No discovery decks, no six-week scoping phase. We map, design and deploy. Then the workflow does its job.",
	steps = DEFAULT_STEPS,
	footnote = "typical first build: 3 weeks from intro call to production.",
	id,
	dataSanity,
}: ProcessProps) {
	return (
		<section
			{...sectionIdProps(id, "process")}
			{...(dataSanity ? { "data-sanity": dataSanity } : {})}
			aria-labelledby="process-heading"
			className="scroll-mt-16 border-t border-relay-line"
		>
			<div className="mx-auto container px-6 py-24">
				<header className="max-w-2xl">
					<p className="mb-4 font-mono text-[13px] text-relay-cyan">
						{eyebrow}
					</p>
					<h2
						id="process-heading"
						className="text-balance text-3xl font-semibold tracking-tight text-relay-ink sm:text-4xl"
					>
						{heading}
					</h2>
					<p className="mt-4 max-w-xl text-pretty text-relay-faint">
						{body}
					</p>
				</header>

				<div className="relative mt-16">
					<div
						aria-hidden="true"
						className="absolute left-[5px] right-[5px] top-[5px] hidden h-0.5 overflow-hidden bg-relay-line md:block"
					>
						<span className="absolute top-0 h-0.5 w-24 animate-relay-rail bg-gradient-to-r from-transparent via-relay-cyan to-transparent" />
					</div>
					<ol className="grid gap-10 md:grid-cols-3 md:gap-4">
						{steps.map((step, index) => (
							<li
								key={step._key ?? step.stepLabel}
								className="relative pl-8 md:pl-0 md:pt-9"
							>
								<span
									aria-hidden="true"
									className="absolute left-0 top-1 size-3 rounded-full border-2 border-relay-cyan bg-relay-bg md:top-0"
								/>
								{index < steps.length - 1 && (
									<span
										aria-hidden="true"
										className="absolute -bottom-10 left-[5px] top-4 w-0.5 overflow-hidden bg-relay-line md:hidden"
									>
										<span
											className="absolute left-0 h-24 w-0.5 animate-relay-rail-y bg-gradient-to-b from-transparent via-relay-cyan to-transparent"
											style={{ animationDelay: `${index * 2.25}s` }}
										/>
									</span>
								)}
								<p className="font-mono text-[11px] tracking-[0.14em] text-relay-cyan">
									{step.stepLabel}
								</p>
								<h3 className="mt-2.5 text-xl font-semibold tracking-tight text-relay-ink">
									{step.title}
								</h3>
								<p className="mt-2 max-w-sm text-sm leading-relaxed text-relay-faint">
									{step.description}
								</p>
								<p className="mt-3.5 font-mono text-[11px] text-relay-faint">
									{step.duration}
								</p>
							</li>
						))}
					</ol>
				</div>

				{footnote && (
					<p className="mt-13 font-mono text-xs text-relay-faint">
						{/* Single template literal, not `</span> {footnote}` — JSX
						    whitespace plus an adjacent expression are two text
						    children, and React separates those with an empty
						    comment node in the SSR output. */}
						<span className="text-relay-cyan">→</span>
						{` ${footnote}`}
					</p>
				)}
			</div>
		</section>
	);
}
