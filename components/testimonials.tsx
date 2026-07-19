import { sectionIdProps } from "@/lib/utils/section-id";
import Image from "next/image";
import type { TestimonialItem } from "@/lib/sanity/lib/adapters";
import { PortableTextRenderer } from "@/lib/sanity/components/PortableTextRenderer";

type RelayTestimonialsProps = {
	testimonials: TestimonialItem[];
	/** Optional Sanity-driven overrides (U13 of the page builder plan) — each
	 * falls back to the original hardcoded copy so existing callers render
	 * byte-identically when omitted. */
	eyebrow?: string;
	heading?: string;
	/** `undefined`/`null` both omit the attribute — see the block adapter's
	 * anchorId handling for why a section with no anchor must render no
	 * `id` at all rather than `id=""`. */
	id?: string | null;
	/** The U13 item-level `data-sanity` attribute for this section. */
	dataSanity?: string;
};

function initials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export function RelayTestimonials({
	testimonials,
	eyebrow = "// what clients say",
	heading = "In their words, not ours.",
	id,
	dataSanity,
}: RelayTestimonialsProps) {
	return (
		<section
			{...sectionIdProps(id, "testimonials")}
			{...(dataSanity ? { "data-sanity": dataSanity } : {})}
			aria-labelledby="testimonials-heading"
			className="scroll-mt-16 border-t border-relay-line"
		>
			<div className="mx-auto container px-6 py-24">
				<header className="max-w-2xl">
					<p className="mb-4 font-mono text-[13px] text-relay-cyan">
						{eyebrow}
					</p>
					<h2
						id="testimonials-heading"
						className="text-balance text-3xl font-semibold tracking-tight text-relay-ink sm:text-4xl"
					>
						{heading}
					</h2>
				</header>

				<ul className="mt-13 grid items-stretch gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
					{testimonials.map((testimonial) => (
						<li key={testimonial.id}>
							<figure className="flex h-full flex-col rounded-lg border border-relay-line bg-relay-panel p-7 transition-colors hover:border-relay-cyan/50">
								<span
									aria-hidden="true"
									className="mb-5 font-mono text-[13px] text-relay-cyan"
								>
									{"// "}
									{(
										testimonial.locationName ||
										testimonial.company ||
										testimonial.role ||
										"connection"
									).toLowerCase()}
								</span>
								<blockquote className="text-[15px] leading-relaxed text-relay-ink [&_.typo>p]:mb-3 [&_.typo>p]:text-relay-ink [&_.typo>p:last-child]:mb-0">
									<PortableTextRenderer value={testimonial.quote as never} />
								</blockquote>
								<figcaption className="mt-auto flex items-center gap-3.5 border-t border-relay-line pt-5">
									{testimonial.headshotUrl ? (
										<Image
											src={testimonial.headshotUrl}
											alt={`Portrait of ${testimonial.authorName}`}
											width={44}
											height={44}
											className="size-11 rounded-full border border-relay-line object-cover"
										/>
									) : (
										<span
											aria-hidden="true"
											className="flex size-11 items-center justify-center rounded-full border border-relay-line bg-relay-raised font-mono text-xs text-relay-cyan"
										>
											{initials(testimonial.authorName)}
										</span>
									)}
									<div>
										<p className="text-sm font-semibold text-relay-ink">
											{testimonial.authorName}
										</p>
										<p className="mt-0.5 font-mono text-[11px] text-relay-faint">
											{[testimonial.role, testimonial.company]
												.filter(Boolean)
												.join(" · ")}
										</p>
									</div>
								</figcaption>
							</figure>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
