import { Navigation } from "@/components/navigation";
import { ContactHero } from "@/components/contact-hero";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";

export const metadata = {
	title: "Contact Us - Granite Marketing | Get in Touch",
	description:
		"Get in touch with Granite Marketing. Fill out our contact form to discuss your AI automation needs, workflow optimization, or general inquiries.",
};

// Fully static page - never revalidate
export const dynamic = "force-static";
export const revalidate = false;

export default function ContactPage() {
	return (
		<>
			<Navigation />
			<main className="min-h-screen">
				<ContactHero />
				<ContactForm />
			</main>
			<Footer />
		</>
	);
}

