"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { CaseStudyCard } from "@/lib/sanity/lib/adapters";

type CaseStudySliderProps = {
	caseStudies: CaseStudyCard[];
};

/**
 * Two case studies visible at a time, arrows step one study over.
 * Cards match the approved comp: header bar, title, excerpt, metrics.
 */
export function CaseStudySlider({ caseStudies }: CaseStudySliderProps) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		slidesToScroll: 1,
		loop: true,
	});
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(false);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setCanPrev(emblaApi.canScrollPrev());
		setCanNext(emblaApi.canScrollNext());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on("select", onSelect);
		emblaApi.on("reInit", onSelect);
		return () => {
			emblaApi.off("select", onSelect);
			emblaApi.off("reInit", onSelect);
		};
	}, [emblaApi, onSelect]);

	if (caseStudies.length === 0) return null;

	const arrowClass =
		"flex size-10 cursor-pointer items-center justify-center rounded border border-relay-line font-mono text-relay-faint transition-colors hover:border-relay-cyan hover:text-relay-cyan disabled:pointer-events-none disabled:opacity-40";

	return (
		<div className="mt-3.5">
			<div className="overflow-hidden" ref={emblaRef}>
				<ul className="-ml-3.5 flex">
					{caseStudies.map((study) => (
						<li
							key={study.id}
							className="min-w-0 shrink-0 grow-0 basis-full pl-3.5 md:basis-1/2"
						>
							<article className="flex h-full flex-col overflow-hidden rounded-lg border border-relay-line bg-relay-panel transition-colors hover:border-relay-cyan/50">
								<header className="flex items-center justify-between gap-4 border-b border-relay-line px-6 py-3 font-mono text-xs">
									<span className="text-relay-cyan">
										{"// "}
										{(study.industryName ?? "case study").toLowerCase()}
									</span>
									{study.client && (
										<span className="text-relay-faint">
											{study.client.toLowerCase()}
										</span>
									)}
								</header>

								<div className="flex grow flex-col p-6">
									<div className="mb-6">
										<h3 className="text-balance text-xl font-semibold tracking-tight text-relay-ink">
											{study.title}
										</h3>
										{study.excerpt && (
											<p className="mt-3 text-pretty text-sm leading-relaxed text-relay-faint">
												{study.excerpt}
											</p>
										)}
									</div>

									{study.results.length > 0 && (
										<ul className="mt-auto grid grid-cols-2 gap-x-6 gap-y-4 border-t border-relay-line pt-5 sm:grid-cols-4">
											{study.results.slice(0, 4).map((result) => (
												<li key={`${study.id}-${result.label}`}>
													<p className="text-xl font-semibold tabular-nums tracking-tight text-relay-ink">
														{result.value}
													</p>
													<p className="mt-0.5 font-mono text-[10px] text-relay-faint">
														{result.label}
													</p>
												</li>
											))}
										</ul>
									)}

									{study.techStack.length > 0 && (
										<p className="mt-5 border-t border-relay-line pt-4 font-mono text-[11px] text-relay-faint">
											<span className="text-relay-cyan">stack: </span>
											{study.techStack
												.map((tool) => tool.title.toLowerCase())
												.join(" · ")}
										</p>
									)}
								</div>
							</article>
						</li>
					))}
				</ul>
			</div>

			{caseStudies.length > 2 && (
				<div className="mt-3.5 flex justify-end gap-2">
					<button
						type="button"
						onClick={() => emblaApi?.scrollPrev()}
						disabled={!canPrev}
						className={arrowClass}
					>
						<span aria-hidden="true">←</span>
						<span className="sr-only">Previous case study</span>
					</button>
					<button
						type="button"
						onClick={() => emblaApi?.scrollNext()}
						disabled={!canNext}
						className={arrowClass}
					>
						<span aria-hidden="true">→</span>
						<span className="sr-only">Next case study</span>
					</button>
				</div>
			)}
		</div>
	);
}
