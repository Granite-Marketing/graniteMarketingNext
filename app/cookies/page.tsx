import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { generatePageMetadata, getBreadcrumbSchema, siteConfig } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("cookies", {
  alternates: {
    canonical: `${siteConfig.url}/cookies`,
  },
});

export default function CookiesPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Cookie Policy", url: "/cookies" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      
      <Header />
      <main id="main" className="main-wrapper pt-24">
        <section className="section-cookies">
          <div className="px-6 padding-section-large">
            <div className="container max-w-3xl">
              <header className="mb-12">
                <h1 className="heading-style-h1 mb-4">Cookie Policy</h1>
                <p className="text-brand-off-white">Last updated: December 2024</p>
              </header>

              <div className="rich-text space-y-8">
                <section>
                  <h2 className="heading-style-h3 mb-4">What Are Cookies</h2>
                  <p className="text-brand-off-white mb-4">
                    Cookies are small text files that are placed on your computer or mobile 
                    device when you visit a website. They are widely used to make websites 
                    work more efficiently and provide information to website owners.
                  </p>
                </section>

                <section>
                  <h2 className="heading-style-h3 mb-4">How We Use Cookies</h2>
                  <p className="text-brand-off-white mb-4">
                    We use cookies for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 text-brand-off-white space-y-2">
                    <li>
                      <strong>Essential cookies:</strong> Required for the website to function properly
                    </li>
                    <li>
                      <strong>Analytics cookies:</strong> Help us understand how visitors interact 
                      with our website
                    </li>
                    <li>
                      <strong>Marketing cookies:</strong> Used to deliver relevant advertisements 
                      and track campaign performance
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="heading-style-h3 mb-4">Third-Party Cookies</h2>
                  <p className="text-brand-off-white mb-4">
                    We use the following third-party services that may set cookies:
                  </p>
                  <ul className="list-disc pl-6 text-brand-off-white space-y-2">
                    <li>Google Analytics - for website analytics</li>
                  </ul>
                </section>

                <section>
                  <h2 className="heading-style-h3 mb-4">Managing Cookies</h2>
                  <p className="text-brand-off-white mb-4">
                    Most web browsers allow you to control cookies through their settings. 
                    You can set your browser to refuse all cookies or to indicate when a 
                    cookie is being sent. However, some features of our website may not 
                    function properly without cookies.
                  </p>
                </section>

                <section>
                  <h2 className="heading-style-h3 mb-4">Contact Us</h2>
                  <p className="text-brand-off-white">
                    If you have questions about our use of cookies, please contact us at{" "}
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
