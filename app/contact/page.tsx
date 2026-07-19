import { Nav } from "@/components/nav";
import { Contact } from "@/components/contact";
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
			<Nav />
			<main className="min-h-screen">
				<Contact />
			</main>
			<Footer />
		</>
	);
}
