import { capabilities } from "./data";

export function RelayCapabilities() {
	return (
		<section
			id="services"
			aria-labelledby="capabilities-heading"
			className="scroll-mt-16 border-t border-relay-line"
		>
			<div className="mx-auto container px-6 py-24">
				<header className="max-w-2xl">
					<p className="mb-4 font-mono text-[13px] text-relay-cyan">
						{"// capabilities"}
					</p>
					<h2
						id="capabilities-heading"
						className="text-balance text-3xl font-semibold tracking-tight text-relay-ink sm:text-4xl"
					>
						Built for the work you&apos;re tired of doing.
					</h2>
					<p className="mt-4 max-w-xl text-pretty text-relay-faint">
						Six systems, each scoped to a job your team currently does by
						hand. Start with one. They&apos;re designed to be wired together.
					</p>
				</header>

				<ul className="mt-13 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-12">
					{capabilities.map((cap) => (
						<li
							key={cap.tag}
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

				<p className="mt-11">
					<a
						href="#contact"
						className="border-b border-relay-cyan/30 pb-1 font-mono text-[13px] text-relay-cyan transition-colors hover:border-relay-cyan"
					>
						Map your first automation →
					</a>
				</p>
			</div>
		</section>
	);
}
