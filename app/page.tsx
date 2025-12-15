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
import { getHomeContent } from "@/lib/sanity/queries";
import { adaptClientTestimonial, adaptFAQItem } from "@/lib/sanity/lib/adapters";

export default async function Home() {
	const homeContent = await getHomeContent();

	const testimonials =
		homeContent.testimonials?.map((client: any) =>
			adaptClientTestimonial(client, client.location?.name)
		) ?? [];

	const faqs =
		homeContent.faqs?.map((faq: any) => adaptFAQItem(faq)) ?? [];

	return (
		<>
			<Navigation />
			<main className="min-h-screen">
				<Hero />
				<Capabilities />
				{/* Will come back to this later. */}
				{/* <Integrations /> */}
				<SplitSection />
				<StatsSection />
				<Approach />
				{testimonials.length >= 6 && (
					<Testimonials testimonials={testimonials.slice(0, 6)} />
				)}
				<FAQ faqs={faqs} />
				<CTASection />
			</main>
			<Footer />
		</>
	);
}
