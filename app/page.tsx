import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { Capabilities } from "@/components/capabilities";
import { Integrations } from "@/components/integrations";
import { SplitSection } from "@/components/split-section";
import { StatsSection } from "@/components/stats-section";
import { Approach } from "@/components/approach";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { CaseStudySection } from "@/components/case-study-section";
import { getHomeContent } from "@/lib/sanity/queries";
import {
	adaptClientTestimonial,
	adaptFAQItem,
	adaptLogoListItem,
	type LogoItem,
} from "@/lib/sanity/lib/adapters";

export default async function Home() {
	const homeContent = (await getHomeContent()) as any;

	const logos: LogoItem[] =
		homeContent.featuredLogos?.map((logoDoc: any) =>
			adaptLogoListItem(logoDoc)
		) ?? [];

	const testimonials =
		homeContent.testimonials?.map((client: any) =>
			adaptClientTestimonial(client, client.location?.name)
		) ?? [];

	const faqs = homeContent.faqs?.map((faq: any) => adaptFAQItem(faq)) ?? [];

	return (
		<>
			<Navigation />
			<main className="min-h-screen">
				<Hero logos={logos} />
				<Capabilities />
				{/* Will come back to this later. */}
				{/* <Integrations /> */}
				<SplitSection />
				{/* <StatsSection /> */}
				{homeContent.caseStudies?.length > 0 && (
					<CaseStudySection caseStudies={homeContent.caseStudies} />
				)}
				<Approach />
				{testimonials.length > 1 && (
					<Testimonials testimonials={testimonials} />
				)}
				<FAQ faqs={faqs} />
				<CTASection />
			</main>
			<Footer />
		</>
	);
}
