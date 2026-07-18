import { RelayNav } from "@/components/nav";
import { RelayFooter } from "@/components/footer";

export const metadata = {
	title: "Privacy Policy - Granite Marketing",
	description: "Privacy policy for Granite Marketing.",
};

// Fully static page
export const dynamic = "force-static";

export default function PrivacyPage() {
	return (
		<>
			<RelayNav />
			<main className="min-h-screen pt-32 pb-16">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-4xl md:text-5xl font-semibold mb-8">Privacy Policy</h1>
						<div className="typo">
							<p><strong>Last updated:</strong> 3 April 2026</p>

							<h2>1. Data controller</h2>
							<p>
								Granite Marketing is the data controller responsible for your personal data collected through this website.
							</p>
							<ul>
								<li><strong>Company:</strong> Granite Marketing</li>
								<li><strong>Address:</strong> Unit 5, 42 Brick Lane, London E1 6RF</li>
								<li><strong>Email:</strong> <a href="mailto:info@granitemarketing.co.uk">info@granitemarketing.co.uk</a></li>
							</ul>

							<h2>2. What data we collect</h2>
							<p>We collect personal data in the following ways:</p>

							<h3>2.1 Contact form</h3>
							<p>
								When you submit our contact form we collect your first name, last name, email address, phone number, inquiry type, situation checkboxes (describing your current needs), and your message.
							</p>

							<h3>2.2 Appointment booking</h3>
							<p>
								When you book a 30-minute consultation through our embedded Cal.com scheduling tool, Cal.com collects the information you provide (such as your name, email address, and any notes you add). Please refer to{" "}
								<a href="https://cal.com/privacy" target="_blank" rel="noopener noreferrer">Cal.com&apos;s privacy policy</a>{" "}
								for details on how they handle your data.
							</p>

							<h3>2.3 Browsing and analytics data</h3>
							<p>
								We use Google Analytics and Vercel Analytics to collect anonymised usage data such as pages visited, time on site, referral source, browser type, device type, and approximate geographic location. This data does not directly identify you.
							</p>

							<h2>3. How we use your data</h2>
							<p>We use the personal data we collect to:</p>
							<ul>
								<li>Respond to your inquiries submitted through our contact form</li>
								<li>Schedule and deliver consultations you have booked</li>
								<li>Provide our AI workflow automation consulting services</li>
								<li>Send invoices and process payments for services rendered</li>
								<li>Analyse website usage to improve our content and user experience</li>
								<li>Monitor website performance and resolve technical issues</li>
							</ul>

							<h2>4. Legal basis for processing</h2>
							<p>Under the UK General Data Protection Regulation (UK GDPR), we rely on the following lawful bases:</p>
							<ul>
								<li>
									<strong>Consent:</strong> When you submit our contact form or book a consultation, you consent to us processing the data you provide for that purpose. You may withdraw consent at any time by emailing us.
								</li>
								<li>
									<strong>Contractual necessity:</strong> Where we need to process your data to perform a contract with you or to take steps at your request before entering into a contract (for example, delivering consulting services you have engaged us for).
								</li>
								<li>
									<strong>Legitimate interest:</strong> We use analytics data to understand how visitors use our website so we can improve it. This processing is proportionate and does not override your rights.
								</li>
							</ul>

							<h2>5. Third-party processors</h2>
							<p>
								We share personal data only with trusted third-party service providers who process data on our behalf. Each provider is contractually required to protect your data.
							</p>
							<table>
								<thead>
									<tr>
										<th>Provider</th>
										<th>Purpose</th>
										<th>Data processed</th>
										<th>Country</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Google Analytics</td>
										<td>Website analytics</td>
										<td>Anonymised browsing data, cookies</td>
										<td>USA (adequate safeguards in place)</td>
									</tr>
									<tr>
										<td>Vercel Analytics</td>
										<td>Performance analytics</td>
										<td>Anonymised page-load and performance metrics</td>
										<td>USA (adequate safeguards in place)</td>
									</tr>
									<tr>
										<td>Cal.com</td>
										<td>Appointment scheduling</td>
										<td>Name, email, booking details</td>
										<td>USA (adequate safeguards in place)</td>
									</tr>
									<tr>
										<td>Wise Business</td>
										<td>Payment processing</td>
										<td>Invoice and payment details</td>
										<td>UK / EEA</td>
									</tr>
								</tbody>
							</table>
							<p>
								Where data is transferred outside the UK, we ensure appropriate safeguards are in place in accordance with UK GDPR requirements, such as standard contractual clauses or adequacy decisions.
							</p>

							<h2>6. Payment data</h2>
							<p>
								All payments are processed securely by Wise Business. We never store, process, or have access to your payment card details. Wise handles all payment information in accordance with applicable regulations. For more information, please refer to{" "}
								<a href="https://wise.com/gb/legal/global-privacy-statement-for-wise-website" target="_blank" rel="noopener noreferrer">Wise&apos;s privacy statement</a>.
							</p>

							<h2>7. Data retention</h2>
							<ul>
								<li>
									<strong>Contact form submissions:</strong> We retain the personal data you provide via our contact form for up to 24 months from the date of submission, after which it is securely deleted unless we have an ongoing business relationship with you.
								</li>
								<li>
									<strong>Booking data:</strong> Retained by Cal.com in accordance with their own retention policies.
								</li>
								<li>
									<strong>Analytics data:</strong> Retained by Google Analytics and Vercel Analytics according to their respective default retention periods.
								</li>
								<li>
									<strong>Invoicing and payment records:</strong> Retained for up to 6 years to comply with UK tax and accounting obligations.
								</li>
							</ul>

							<h2>8. Your rights under UK GDPR</h2>
							<p>You have the following rights in relation to your personal data:</p>
							<ul>
								<li><strong>Right of access</strong> &mdash; request a copy of the personal data we hold about you.</li>
								<li><strong>Right to rectification</strong> &mdash; request correction of inaccurate or incomplete data.</li>
								<li><strong>Right to erasure</strong> &mdash; request deletion of your personal data where there is no compelling reason for us to continue processing it.</li>
								<li><strong>Right to restriction of processing</strong> &mdash; request that we limit how we use your data.</li>
								<li><strong>Right to data portability</strong> &mdash; request a copy of your data in a structured, commonly used, machine-readable format.</li>
								<li><strong>Right to object</strong> &mdash; object to processing based on legitimate interest.</li>
								<li><strong>Right to withdraw consent</strong> &mdash; where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of processing carried out before withdrawal.</li>
							</ul>
							<p>
								To exercise any of these rights, please email us at{" "}
								<a href="mailto:info@granitemarketing.co.uk">info@granitemarketing.co.uk</a>.
								We will respond to your request within one month.
							</p>

							<h2>9. Cookies</h2>
							<p>
								Our website uses cookies to support analytics and improve your browsing experience. For full details on the cookies we use, how to manage them, and your choices, please see our{" "}
								<a href="/cookies">Cookie Policy</a>.
							</p>

							<h2>10. How to contact us</h2>
							<p>
								If you have any questions about this privacy policy or the way we handle your personal data, please contact us:
							</p>
							<ul>
								<li><strong>Email:</strong> <a href="mailto:info@granitemarketing.co.uk">info@granitemarketing.co.uk</a></li>
								<li><strong>Post:</strong> Granite Marketing, Unit 5, 42 Brick Lane, London E1 6RF</li>
							</ul>

							<h2>11. Right to complain</h2>
							<p>
								If you are unhappy with how we have handled your personal data, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO):
							</p>
							<ul>
								<li>
									<strong>Website:</strong>{" "}
									<a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">https://ico.org.uk</a>
								</li>
								<li><strong>Telephone:</strong> 0303 123 1113</li>
							</ul>
							<p>
								We would appreciate the opportunity to address your concerns before you contact the ICO, so please reach out to us first.
							</p>

							<h2>12. Changes to this policy</h2>
							<p>
								We may update this privacy policy from time to time to reflect changes in our practices, technology, or legal requirements. Any changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. We encourage you to review this page periodically.
							</p>
						</div>
					</div>
				</div>
			</main>
			<RelayFooter />
		</>
	);
}
