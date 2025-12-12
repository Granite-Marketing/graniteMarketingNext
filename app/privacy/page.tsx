import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { generatePageMetadata, getBreadcrumbSchema, siteConfig } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("privacy", {
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
});

export default function PrivacyPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      
      <Header />
      <main id="main" className="main-wrapper pt-24">
        <section className="section-privacy">
          <div className="px-6 padding-section-large">
            <div className="container max-w-3xl">
              <header className="mb-12">
                <h1 className="heading-style-h1 mb-4">Privacy Policy</h1>
                <p className="text-brand-off-white">Last updated: December 2024</p>
              </header>

              <div className="rich-text space-y-8">
                <section>
                  <h2 className="heading-style-h3 mb-4">Introduction</h2>
                  <p className="text-brand-off-white mb-4">
                    Granite Marketing (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is 
                    committed to protecting your personal data. This privacy policy explains how 
                    we collect, use, and safeguard your information when you visit our website 
                    or use our services.
                  </p>
                </section>

                <section>
                  <h2 className="heading-style-h3 mb-4">Information We Collect</h2>
                  <p className="text-brand-off-white mb-4">
                    We may collect the following types of information:
                  </p>
                  <ul className="list-disc pl-6 text-brand-off-white space-y-2">
                    <li>Contact information (name, email address, phone number)</li>
                    <li>Company information</li>
                    <li>Project requirements and preferences</li>
                    <li>Usage data (pages visited, time spent on site)</li>
                    <li>Technical data (IP address, browser type, device information)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="heading-style-h3 mb-4">How We Use Your Information</h2>
                  <p className="text-brand-off-white mb-4">
                    We use your information to:
                  </p>
                  <ul className="list-disc pl-6 text-brand-off-white space-y-2">
                    <li>Respond to your inquiries and provide customer support</li>
                    <li>Deliver our services and manage projects</li>
                    <li>Send relevant updates and marketing communications (with your consent)</li>
                    <li>Improve our website and services</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="heading-style-h3 mb-4">Data Security</h2>
                  <p className="text-brand-off-white mb-4">
                    We implement appropriate technical and organizational measures to protect 
                    your personal data against unauthorized access, alteration, disclosure, 
                    or destruction.
                  </p>
                </section>

                <section>
                  <h2 className="heading-style-h3 mb-4">Your Rights</h2>
                  <p className="text-brand-off-white mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 text-brand-off-white space-y-2">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to processing of your data</li>
                    <li>Request data portability</li>
                  </ul>
                </section>

                <section>
                  <h2 className="heading-style-h3 mb-4">Contact Us</h2>
                  <p className="text-brand-off-white">
                    If you have questions about this privacy policy or your personal data, 
                    please contact us at{" "}
                    <a href="mailto:hello@granitemarketing.com" className="text-brand-green hover:underline">
                      hello@granitemarketing.com
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
