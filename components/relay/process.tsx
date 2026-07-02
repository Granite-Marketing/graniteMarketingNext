import { processSteps } from "./data";

export function RelayProcess() {
	return (
		<section
			id="process"
			aria-labelledby="process-heading"
			className="scroll-mt-16 border-t border-relay-line"
		>
			<div className="mx-auto container px-6 py-24">
				<header className="max-w-2xl">
					<p className="mb-4 font-mono text-[13px] text-relay-cyan">
						{"// how we ship"}
					</p>
					<h2
						id="process-heading"
						className="text-balance text-3xl font-semibold tracking-tight text-relay-ink sm:text-4xl"
					>
						From first call to running in production.
					</h2>
					<p className="mt-4 max-w-xl text-pretty text-relay-faint">
						No discovery decks, no six-week scoping phase. We map, design and
						deploy. Then the workflow does its job.
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
						{processSteps.map((step, index) => (
							<li
								key={step.index}
								className="relative pl-8 md:pl-0 md:pt-9"
							>
								<span
									aria-hidden="true"
									className="absolute left-0 top-1 size-3 rounded-full border-2 border-relay-cyan bg-relay-bg md:top-0"
								/>
								{index < processSteps.length - 1 && (
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
									{step.index}
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

				<p className="mt-13 font-mono text-xs text-relay-faint">
					<span className="text-relay-cyan">→</span> typical first build: 3
					weeks from intro call to production.
				</p>
			</div>
		</section>
	);
}
