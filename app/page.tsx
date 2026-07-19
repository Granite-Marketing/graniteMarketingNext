import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Capabilities } from "@/components/capabilities";
import { ToolsStrip } from "@/components/tools-strip";
import { Process } from "@/components/process";
import { Results } from "@/components/results";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { getHomeContent, getTools } from "@/lib/sanity/queries";
import {
	adaptClientTestimonial,
	adaptFAQItem,
} from "@/lib/sanity/lib/adapters";

// ISR with 30 minute revalidation for homepage content
export const revalidate = 1800; // 30 minutes

export default async function Home() {
	const [homeContent, tools] = (await Promise.all([
		getHomeContent(),
		getTools(),
	])) as [any, any];

	const testimonials =
		homeContent.testimonials?.map((client: any) =>
			adaptClientTestimonial(client, client.location?.name),
		) ?? [];

	const faqs = homeContent.faqs?.map((faq: any) => adaptFAQItem(faq)) ?? [];

	return (
		<div className="bg-relay-bg text-relay-ink selection:bg-relay-cyan selection:text-relay-bg">
			<Nav />
			<main className="min-h-screen">
				<Hero clientLogos={homeContent.featuredLogos ?? []} />
				<Capabilities />
				<ToolsStrip tools={tools ?? []} />
				<Process />
				<Results caseStudies={homeContent.caseStudies ?? []} />
				{testimonials.length > 0 && (
					<Testimonials testimonials={testimonials} />
				)}
				{faqs.length > 0 && <FAQ faqs={faqs} />}
				<CTA />
			</main>
			<Footer />
		</div>
	);
}
