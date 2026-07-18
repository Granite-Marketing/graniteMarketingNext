import { RelayNav } from "@/components/nav";
import { RelayFooter } from "@/components/footer";

export const metadata = {
	title: "Delivery Policy - Granite Marketing",
	description: "Service delivery policy for Granite Marketing's AI workflow automation services.",
};

// Fully static page
export const dynamic = "force-static";

export default function DeliveryPolicyPage() {
	return (
		<>
			<RelayNav />
			<main className="min-h-screen pt-32 pb-16">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-4xl md:text-5xl font-semibold mb-8">Delivery Policy</h1>
						<div className="typo">
							<p><strong>Last updated:</strong> 3 April 2026</p>

							<h2>1. Overview</h2>
							<p>
								Granite Marketing provides digital services, specifically AI workflow automation consulting and implementation. As a digital services provider, there are no physical goods to ship. This policy outlines how we deliver our services to clients.
							</p>

							<h2>2. Service delivery model</h2>
							<p>
								All engagements are project-based, with defined milestones agreed upon at the start of each project. The scope, timeline, and deliverables are confirmed before work begins.
							</p>

							<h2>3. Typical project phases</h2>
							<p>While every project is different, most engagements follow these phases:</p>
							<ul>
								<li><strong>Discovery &amp; scoping</strong> &mdash; 1&ndash;2 business days. We review your requirements, systems, and goals to define the project scope.</li>
								<li><strong>Design &amp; build</strong> &mdash; 4&ndash;6 weeks for a typical MVP, depending on scope and complexity. We design and develop your custom automations.</li>
								<li><strong>Testing &amp; quality assurance</strong> &mdash; 2&ndash;3 business days. We thoroughly test all workflows to ensure they perform as expected.</li>
								<li><strong>Handover &amp; deployment</strong> &mdash; 1&ndash;2 business days. We deploy the finished automations to your platform and walk you through everything.</li>
							</ul>

							<h2>4. Deliverables</h2>
							<p>Depending on the project, deliverables typically include:</p>
							<ul>
								<li>Working automations deployed to the client&apos;s platform (n8n, Make, Zapier, or similar)</li>
								<li>Project documentation covering workflow logic, configuration, and maintenance guidance</li>
								<li>A training session where applicable, to ensure your team can manage and monitor the automations independently</li>
							</ul>

							<h2>5. Communication</h2>
							<p>
								Progress updates are provided at each milestone via email. Your primary point of contact throughout the project is the assigned project lead, who will keep you informed at every stage.
							</p>

							<h2>6. Acceptance</h2>
							<p>
								Deliverables are considered accepted 7 business days after handover unless the client raises issues in writing. We encourage clients to review and test deliverables promptly so that any adjustments can be made as quickly as possible.
							</p>

							<h2>7. Delays</h2>
							<p>
								If we anticipate a delay to any agreed milestone, we will notify the client within 2 business days and work with you to agree a revised timeline. We are committed to transparent communication throughout every engagement.
							</p>

							<h2>8. Client responsibilities</h2>
							<p>
								To help us maintain project timelines, clients are expected to provide timely access to required systems, feedback, and approvals. Delays in providing these may affect the overall project schedule.
							</p>

							<h2>9. Contact</h2>
							<p>
								If you have any questions about our delivery process or an ongoing project, please contact us:
							</p>
							<ul>
								<li><strong>Email:</strong> <a href="mailto:info@granitemarketing.co.uk">info@granitemarketing.co.uk</a></li>
								<li><strong>Post:</strong> Granite Marketing, Unit 5, 42 Brick Lane, London E1 6RF</li>
							</ul>
						</div>
					</div>
				</div>
			</main>
			<RelayFooter />
		</>
	);
}
