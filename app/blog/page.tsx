import { Navigation } from "@/components/navigation";
import { BlogHero } from "@/components/blog-hero";
import { BlogGrid } from "@/components/blog-grid";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export const metadata = {
	title: "Blog - Granite Marketing | AI Automation Insights",
	description:
		"Discover the latest insights, tutorials, and best practices in AI automation, workflow optimization, and business process improvement.",
};

export default function BlogPage() {
	return (
		<>
			<Navigation />
			<main className="min-h-screen">
				<BlogHero />
				<BlogGrid />
				<CTASection />
				<Footer />
			</main>
			<Footer />
		</>
	);
}
