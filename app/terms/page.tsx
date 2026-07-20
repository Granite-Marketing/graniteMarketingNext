import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata = {
	title: "Terms of Service - Granite Marketing",
	description: "Terms of service for Granite Marketing's AI workflow automation services.",
};

// Fully static page
export const dynamic = "force-static";

export default function TermsPage() {
	return (
		<>
			<Nav />
			<main className="min-h-screen pt-32 pb-16">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-4xl md:text-5xl font-semibold mb-8">Terms of Service</h1>
						<div className="typo">
							<p className="text-muted-foreground">Last updated: 3 April 2026</p>

							<h2>1. Introduction</h2>
							<p>
								These Terms of Service (&quot;Terms&quot;) govern your use of the services provided by
								Granite Marketing (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a business-to-business
								AI workflow automation consultancy based in London, United Kingdom. By engaging our
								services, you (&quot;Client&quot;, &quot;you&quot;, &quot;your&quot;) agree to be bound
								by these Terms.
							</p>
							<p>
								Granite Marketing specialises in designing, building, and integrating AI-powered
								workflow automations that help businesses operate more efficiently. These Terms apply
								to all consulting engagements, project work, and related services we provide.
							</p>

							<h2>2. Services</h2>
							<p>Granite Marketing offers the following AI workflow automation services:</p>
							<ul>
								<li>
									<strong>Project management</strong> — keeping systems in sync and teams aligned
									through automated workflows and integrations.
								</li>
								<li>
									<strong>Lead generation</strong> — automated multi-channel outreach to identify
									and engage prospective clients on your behalf.
								</li>
								<li>
									<strong>Content generation</strong> — blogs, research, and social media posts
									produced on autopilot using AI-driven pipelines.
								</li>
								<li>
									<strong>AI Agents</strong> — autonomous agents built to handle complex,
									high-volume tasks and heavy lifting.
								</li>
								<li>
									<strong>Research assistant</strong> — AI-powered support for smarter, faster
									business decisions.
								</li>
								<li>
									<strong>Educational tools</strong> — turning raw data into actionable learning
									content and training materials.
								</li>
							</ul>
							<p>
								In addition to the above, we provide general consulting and systems integration
								services related to AI workflow automation. The specific deliverables for each
								engagement are defined in the project scope agreed between both parties.
							</p>

							<h2>3. Engagement and Scope</h2>
							<p>
								Each engagement begins upon mutual written agreement (including email) between
								Granite Marketing and the Client. This agreement will outline the scope of work,
								timelines, deliverables, and fees.
							</p>
							<p>
								The scope of work is defined on a per-project basis. Any changes to the agreed scope,
								including additional features, revised timelines, or new deliverables, must be agreed
								in writing by both parties before work commences on the amended scope.
							</p>

							<h2>4. Fees and Payment</h2>
							<p>
								All fees are quoted and invoiced in British Pounds Sterling (GBP, &pound;). The fees
								for each engagement will be outlined in the project agreement.
							</p>
							<p>
								Project engagements typically require a 50% deposit before work begins, with the
								remaining 50% due on completion. Payment terms are 7&ndash;14 days from invoice
								date unless otherwise agreed in writing. Payments are processed via Wise Business.
							</p>
							<p>
								We reserve the right to suspend work on any project where payment is overdue,
								until the outstanding balance is settled in full.
							</p>

							<h2>5. Intellectual Property</h2>
							<p>
								Upon receipt of full payment, the Client owns all rights to the deliverables produced
								as part of the engagement, unless otherwise agreed in writing.
							</p>
							<p>
								Granite Marketing retains the right to use anonymised case studies, screenshots, and
								portfolio examples derived from the engagement for marketing and promotional purposes,
								unless the Client requests otherwise in writing.
							</p>
							<p>
								Any pre-existing intellectual property, tools, frameworks, or templates owned by
								Granite Marketing and used during the engagement remain the property of Granite
								Marketing.
							</p>

							<h2>6. Confidentiality</h2>
							<p>
								Both parties agree to keep confidential any proprietary or sensitive information
								disclosed during the engagement. This includes, but is not limited to, business
								strategies, technical specifications, customer data, and financial information.
							</p>
							<p>
								Confidential information shall not be disclosed to any third party without the prior
								written consent of the disclosing party, except where required by law.
							</p>

							<h2>7. Limitation of Liability</h2>
							<p>
								To the maximum extent permitted by law, the total liability of Granite Marketing
								arising out of or in connection with any engagement shall be limited to the total
								fees paid by the Client in the 12 months preceding the claim.
							</p>
							<p>
								Granite Marketing shall not be liable for any indirect, incidental, special,
								consequential, or punitive damages, including but not limited to loss of profits,
								revenue, data, or business opportunities, howsoever arising.
							</p>
							<p>
								Nothing in these Terms excludes or limits liability for death or personal injury
								caused by negligence, fraud, or any other liability that cannot be excluded or
								limited under applicable law.
							</p>

							<h2>8. Termination</h2>
							<p>
								Either party may terminate an engagement by providing 30 days&apos; written notice to
								the other party.
							</p>
							<p>
								Upon termination, all work completed up to the date of termination will be invoiced,
								and payment for such work remains due in accordance with these Terms.
							</p>
							<p>
								Termination does not affect any rights or obligations that have accrued prior to the
								date of termination, including the confidentiality obligations set out in Section 6.
							</p>

							<h2>9. Company Information</h2>
							<p>
								Granite Marketing is registered and operates in the United Kingdom.
							</p>

							<h2>10. Payment Security</h2>
							<p>
								All card payments are processed securely by Wise Business. Granite Marketing never
								stores, processes, or has access to your payment card details. Wise is authorised by
								the Financial Conduct Authority (FCA) as an Electronic Money Institution.
							</p>

							<h2>11. Governing Law</h2>
							<p>
								These Terms are governed by the laws of England and Wales. Any disputes arising out
								of or in connection with these Terms shall be subject to the exclusive jurisdiction of
								the courts of England and Wales.
							</p>

							<h2>12. Contact</h2>
							<p>
								If you have any questions about these Terms, please contact us:
							</p>
							<ul>
								<li>
									<strong>Email:</strong>{" "}
									<a href="mailto:info@granitemarketing.co.uk">info@granitemarketing.co.uk</a>
								</li>
								<li>
									<strong>Address:</strong> Unit 5, 42 Brick Lane, London E1 6RF
								</li>
								<li>
									<strong>Website:</strong>{" "}
									<a href="https://granitemarketing.com">granitemarketing.com</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
