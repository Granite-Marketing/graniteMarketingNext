"use client";

import { useState } from "react";
import { ArrowRightIcon, ArrowLeftIcon } from "@/components/icons";

interface Testimonial {
	quote: string;
	author: string;
	company: string;
	role?: string;
}

// Placeholder testimonials - would come from Sanity
const testimonials: Testimonial[] = [
	{
		quote:
			"Granite Marketing transformed our content workflow. What used to take our team a week now happens in hours. The automation they built is reliable, scalable, and exactly what we needed.",
		author: "Sarah Chen",
		company: "TechFlow Solutions",
		role: "Head of Marketing",
	},
	{
		quote:
			"Working with the team was a game-changer for our lead generation. They understood our requirements immediately and delivered an automation that exceeded our expectations.",
		author: "Marcus Johnson",
		company: "Growth Labs",
		role: "Founder & CEO",
	},
	{
		quote:
			"The ROI was immediate. Within the first month, we saw a 10x increase in our content output without adding any new team members. Highly recommend.",
		author: "Emily Rodriguez",
		company: "Startup Ventures",
		role: "Operations Director",
	},
];

export default function Testimonials() {
	const [currentIndex, setCurrentIndex] = useState(0);

	const goToPrevious = () => {
		setCurrentIndex((prev) =>
			prev === 0 ? testimonials.length - 1 : prev - 1
		);
	};

	const goToNext = () => {
		setCurrentIndex((prev) =>
			prev === testimonials.length - 1 ? 0 : prev + 1
		);
	};

	const currentTestimonial = testimonials[currentIndex];

	return (
		<section aria-labelledby="testimonials-heading">
			<div className="px-6 padding-section-large">
				<div className="container">
					<h2
						id="testimonials-heading"
						className="heading-style-h2 text-center mb-12"
					>
						Client and associate testimonials
					</h2>

					{/* Testimonial - using figure/blockquote/figcaption for proper semantics */}
					<figure className=" mx-auto gradient-border p-8 md:p-12 text-center">
						<blockquote className="text-xl md:text-2xl lg:text-3xl text-brand-white leading-relaxed mb-8">
							<p>&ldquo;{currentTestimonial.quote}&rdquo;</p>
						</blockquote>

						<figcaption>
							<cite className="not-italic">
								<strong className="text-brand-green font-medium text-lg block">
									{currentTestimonial.author}
								</strong>
								<span className="font-mono text-neutral-light text-sm">
									{currentTestimonial.role && `${currentTestimonial.role} at `}
									{currentTestimonial.company}
								</span>
							</cite>
						</figcaption>
					</figure>

					{/* Navigation Controls */}
					<nav
						className="mt-8 flex items-center justify-center gap-8"
						aria-label="Testimonial navigation"
					>
						{/* Pagination dots */}
						<ul className="flex gap-3">
							{testimonials.map((_, index) => (
								<li key={index}>
									<button
										type="button"
										onClick={() => setCurrentIndex(index)}
										className={`w-3 h-3 border border-white transition-colors ${
											index === currentIndex ? "bg-white" : "bg-transparent"
										}`}
										aria-label={`Go to testimonial ${index + 1}`}
										aria-current={index === currentIndex ? "true" : undefined}
									/>
								</li>
							))}
						</ul>

						{/* Arrow buttons */}
						<div className="flex gap-2">
							<button
								type="button"
								onClick={goToPrevious}
								aria-label="Previous testimonial"
								className="w-10 h-10 border border-neutral-dark rounded-lg flex items-center justify-center text-white hover:bg-neutral-dark transition-colors"
							>
								<ArrowLeftIcon size={24} />
							</button>
							<button
								type="button"
								onClick={goToNext}
								aria-label="Next testimonial"
								className="w-10 h-10 border border-neutral-dark rounded-lg flex items-center justify-center text-white hover:bg-neutral-dark transition-colors"
							>
								<ArrowRightIcon size={24} />
							</button>
						</div>
					</nav>
				</div>
			</div>
		</section>
	);
}
