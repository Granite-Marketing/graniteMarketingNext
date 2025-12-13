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

export default function Home() {
	return (
		<>
			<Navigation />
			<main className="min-h-screen">
				<Hero />
				<Capabilities />
				<Integrations />
				<SplitSection />
				<StatsSection />
				<Approach />
				<Testimonials />
				<FAQ />
				<CTASection />
			</main>
			<Footer />
		</>
	);
}
