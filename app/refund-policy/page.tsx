import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata = {
	title: "Refund & Cancellation Policy - Granite Marketing",
	description: "Refund and cancellation policy for Granite Marketing's services.",
};

// Fully static page
export const dynamic = "force-static";

export default function RefundPolicyPage() {
	return (
		<>
			<Nav />
			<main className="min-h-screen pt-32 pb-16">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-4xl md:text-5xl font-semibold mb-8">Refund & Cancellation Policy</h1>
						<div className="typo">
							<p><strong>Last updated:</strong> 3 April 2026</p>

							<h2>1. Overview</h2>
							<p>
								Granite Marketing is a UK-based B2B AI workflow automation consultancy. All services are provided under individual project or retainer agreements. Cancellation and refund terms are governed by the specific contract agreed between Granite Marketing and the client.
							</p>

							<h2>2. Refund policy</h2>
							<p>
								All fees paid for services rendered are non-refundable. Once work has been delivered, whether as part of a project milestone or a monthly retainer period, the associated fees are not subject to refund.
							</p>
							<p>
								Deposits paid at the start of an engagement are non-refundable once work has commenced.
							</p>

							<h2>3. Cancellation</h2>
							<p>
								Cancellation terms are defined in each client&apos;s individual engagement agreement. Retainer engagements are typically on a monthly rolling basis and may be cancelled in accordance with the notice period specified in the contract.
							</p>
							<p>
								Upon cancellation, the client will receive all completed deliverables that have been paid for up to the effective cancellation date.
							</p>

							<h2>4. Disputes</h2>
							<p>
								If you have a concern about any aspect of our services, please contact us at{" "}
								<a href="mailto:info@granitemarketing.co.uk">info@granitemarketing.co.uk</a>{" "}
								so we can address it directly. We aim to resolve all disputes within 14 business days.
							</p>

							<h2>5. Contact</h2>
							<p>
								If you have any questions about this policy, please contact us:
							</p>
							<ul>
								<li><strong>Email:</strong> <a href="mailto:info@granitemarketing.co.uk">info@granitemarketing.co.uk</a></li>
								<li><strong>Post:</strong> Granite Marketing, Unit 5, 42 Brick Lane, London E1 6RF</li>
							</ul>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
