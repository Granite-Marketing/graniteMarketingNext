import { RelayNav } from "@/components/nav";
import { RelayHero } from "@/components/hero";
import { RelayCapabilities } from "@/components/capabilities";
import { RelayToolsStrip } from "@/components/tools-strip";
import { RelayProcess } from "@/components/process";
import { RelayResults } from "@/components/results";
import { RelayTestimonials } from "@/components/testimonials";
import { RelayFAQ } from "@/components/faq";
import { RelayCTA } from "@/components/cta";
import { RelayFooter } from "@/components/footer";
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
			<RelayNav />
			<main className="min-h-screen">
				<RelayHero clientLogos={homeContent.featuredLogos ?? []} />
				<RelayCapabilities />
				<RelayToolsStrip tools={tools ?? []} />
				<RelayProcess />
				<RelayResults caseStudies={homeContent.caseStudies ?? []} />
				{testimonials.length > 0 && (
					<RelayTestimonials testimonials={testimonials} />
				)}
				{faqs.length > 0 && <RelayFAQ faqs={faqs} />}
				<RelayCTA />
			</main>
			<RelayFooter />
		</div>
	);
}
