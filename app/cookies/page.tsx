import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export const metadata = {
	title: "Cookie Policy - Granite Marketing",
	description: "Cookie policy for Granite Marketing.",
};

// Fully static page
export const dynamic = "force-static";

export default function CookiesPage() {
	return (
		<>
			<Navigation />
			<main className="min-h-screen pt-32 pb-16">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-4xl md:text-5xl font-semibold mb-8">Cookie Policy</h1>
						<div className="prose prose-lg dark:prose-invert max-w-none">
							<p><strong>Last updated:</strong> 3 April 2026</p>

							<h2>What are cookies?</h2>
							<p>
								Cookies are small text files that are placed on your device when you visit a website.
								They are widely used to make websites work more efficiently, provide a better browsing
								experience, and supply information to the owners of the site. Cookies can be
								&quot;persistent&quot; (remaining on your device until they expire or you delete them) or
								&quot;session-based&quot; (removed when you close your browser).
							</p>

							<h2>Cookies we use</h2>
							<p>
								The table below explains the cookies we use on this website and why we use them.
							</p>

							<table>
								<thead>
									<tr>
										<th>Cookie name</th>
										<th>Provider</th>
										<th>Purpose</th>
										<th>Type</th>
										<th>Duration</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><code>_ga</code></td>
										<td>Google Analytics</td>
										<td>Distinguishes unique users by assigning a randomly generated number as a client identifier</td>
										<td>Analytics</td>
										<td>2 years</td>
									</tr>
									<tr>
										<td><code>_ga_*</code></td>
										<td>Google Analytics</td>
										<td>Stores and counts page views and session state</td>
										<td>Analytics</td>
										<td>2 years</td>
									</tr>
									<tr>
										<td>Vercel Analytics cookies</td>
										<td>Vercel</td>
										<td>Performance monitoring and page-load analytics</td>
										<td>Analytics</td>
										<td>Session</td>
									</tr>
									<tr>
										<td>Cal.com cookies</td>
										<td>Cal.com</td>
										<td>Booking widget functionality and scheduling state</td>
										<td>Functional</td>
										<td>Session</td>
									</tr>
								</tbody>
							</table>

							<h2>Cookie categories</h2>

							<h3>Strictly necessary cookies</h3>
							<p>
								These cookies are essential for the website to function and cannot be switched off
								in our systems. They are usually only set in response to actions you take, such as
								setting your privacy preferences or filling in forms. We do not currently set any
								strictly necessary cookies beyond standard server-side session handling.
							</p>

							<h3>Analytics and performance cookies</h3>
							<p>
								These cookies allow us to count visits and traffic sources so we can measure and
								improve the performance of our site. They help us understand which pages are the
								most and least popular and see how visitors move around the site. All information
								these cookies collect is aggregated and therefore anonymous. This category includes
								cookies set by Google Analytics and Vercel Analytics.
							</p>

							<h3>Functional cookies</h3>
							<p>
								These cookies enable the website to provide enhanced functionality and
								personalisation. They may be set by us or by third-party providers whose services
								we have added to our pages. This category includes cookies set by the Cal.com
								booking widget, which allows you to schedule meetings directly on our site.
							</p>

							<h2>How to manage cookies</h2>
							<p>
								Most web browsers allow you to control cookies through their settings. You can
								usually find these settings in the &quot;Options&quot; or &quot;Preferences&quot; menu of your
								browser. The following links may be helpful:
							</p>
							<ul>
								<li>
									<a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
										Google Chrome - Manage cookies
									</a>
								</li>
								<li>
									<a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">
										Mozilla Firefox - Enhanced Tracking Protection
									</a>
								</li>
								<li>
									<a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
										Apple Safari - Manage cookies and website data
									</a>
								</li>
								<li>
									<a href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">
										Microsoft Edge - Manage cookies
									</a>
								</li>
							</ul>

							<h2>What happens if you disable cookies</h2>
							<p>
								If you choose to disable cookies, some parts of this website may not function as
								intended. For example:
							</p>
							<ul>
								<li>The Cal.com booking widget may not work correctly, preventing you from scheduling meetings directly through our site.</li>
								<li>We will be unable to gather analytics data to improve your browsing experience.</li>
								<li>Performance monitoring may be limited, which helps us ensure the site loads quickly and reliably.</li>
							</ul>
							<p>
								Disabling cookies will not prevent you from accessing the informational content on
								our website.
							</p>

							<h2>Third-party cookies</h2>
							<p>
								Some cookies on our site are set by third-party services. We use Google Analytics
								to understand how visitors interact with our website, Vercel Analytics for
								performance monitoring, and Cal.com to provide an embedded booking experience.
								These third parties may use cookies to collect information about your online
								activities across different websites. We do not control third-party cookies, and we
								recommend reviewing the privacy policies of these services for more information:
							</p>
							<ul>
								<li>
									<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
										Google Privacy Policy
									</a>
								</li>
								<li>
									<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
										Vercel Privacy Policy
									</a>
								</li>
								<li>
									<a href="https://cal.com/privacy" target="_blank" rel="noopener noreferrer">
										Cal.com Privacy Policy
									</a>
								</li>
							</ul>

							<h2>Our privacy policy</h2>
							<p>
								For more information about how we handle your personal data, please read our{" "}
								<a href="/privacy">Privacy Policy</a>.
							</p>

							<h2>Changes to this policy</h2>
							<p>
								We may update this Cookie Policy from time to time to reflect changes in technology,
								legislation, or our business operations. Any changes will be posted on this page
								with an updated &quot;Last updated&quot; date. We encourage you to check this page
								periodically to stay informed about how we use cookies.
							</p>

							<h2>Contact us</h2>
							<p>
								If you have any questions about this Cookie Policy, please contact us at{" "}
								<a href="mailto:info@granitemarketing.co.uk">info@granitemarketing.co.uk</a>.
							</p>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
