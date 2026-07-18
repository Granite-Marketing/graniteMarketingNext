import { RelayNav } from "@/components/nav";
import { RelayContact } from "@/components/contact";
import { RelayFooter } from "@/components/footer";

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
			<RelayNav />
			<main className="min-h-screen">
				<RelayContact />
			</main>
			<RelayFooter />
		</>
	);
}
