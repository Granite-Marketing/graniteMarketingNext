import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/sections/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import {
	generatePageMetadata,
	getBreadcrumbSchema,
	siteConfig,
} from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("contact", {
	alternates: {
		canonical: `${siteConfig.url}/contact-us`,
	},
});

export default function ContactPage() {
	const breadcrumbs = getBreadcrumbSchema([
		{ name: "Home", url: "/" },
		{ name: "Contact Us", url: "/contact-us" },
	]);

	return (
		<>
			<JsonLd data={breadcrumbs} />

			<Header />
			<main id="main" className="main-wrapper pt-24">
				{/* Hero Section */}
				<section className="section-contact-hero">
					<div className="px-6 padding-section-medium">
						<div className="container  text-center">
							<h1 className="heading-style-h1 mb-6">Get in Touch</h1>
							<p className="text-size-large text-brand-off-white max-w-2xl mx-auto">
								Have a project in mind? We&apos;d love to hear from you. Fill
								out the form below and we&apos;ll get back to you within 24
								hours.
							</p>
						</div>
					</div>
				</section>

				<ContactForm />
			</main>
			<Footer />
		</>
	);
}
