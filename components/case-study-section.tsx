import { Tag } from "@/components/ui/tag";
import type { CaseStudyCard } from "@/lib/sanity/lib/adapters";
import { CaseStudyCardItem } from "./case-study-card";

type CaseStudySectionProps = {
	caseStudies: CaseStudyCard[];
};

export function CaseStudySection({ caseStudies }: CaseStudySectionProps) {
	if (!caseStudies || caseStudies.length === 0) return null;

	return (
		<section
			id="results"
			className="py-24 bg-gradient-to-b from-background to-muted/20"
		>
			<div className="container mx-auto px-4">
				<div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div>
						<Tag variant="sectionLabel" className="mb-2">
							Automation in Action
						</Tag>
						<h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
							Case studies from real teams
						</h2>
						<p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
							A snapshot of the systems we&apos;ve shipped - what we automated,
							the stack behind it, and the lift it created. No fluff, just
							outcomes.
						</p>
					</div>
				</div>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{caseStudies.map((study) => (
						<CaseStudyCardItem key={study.id} study={study} />
					))}
				</div>
			</div>
		</section>
	);
}
