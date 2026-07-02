import { Navigation } from "@/components/navigation";
import { RelayContact } from "@/components/relay/contact";
import { Footer } from "@/components/footer";

export const metadata = {
	title: "Contact Us - Granite Marketing | Get in Touch",
	description:
		"Get in touch with Granite Marketing. Fill out our contact form to discuss your AI automation needs, workflow optimization, or general inquiries.",
};

// Fully static page
export const dynamic = "force-static";

export default function ContactPage() {
	return (
		<>
			<Navigation />
			<main className="min-h-screen">
				<RelayContact />
			</main>
			<Footer />
		</>
	);
}
