import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { PlusIcon } from "@/components/icons";
import Image from "next/image";
import JsonLd from "@/components/seo/JsonLd";
import { generatePageMetadata, getBreadcrumbSchema, siteConfig } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("about", {
  alternates: {
    canonical: `${siteConfig.url}/about-us`,
  },
});

const values = [
  {
    title: "Simplicity First",
    description: "We build automations that are easy to understand, maintain, and scale. No unnecessary complexity.",
  },
  {
    title: "Results-Driven",
    description: "Every automation we build is measured by the time it saves and the problems it solves.",
  },
  {
    title: "Partnership Approach",
    description: "We're not just vendors — we're partners invested in your long-term success.",
  },
  {
    title: "Continuous Improvement",
    description: "We stay on top of the latest tools and techniques to deliver cutting-edge solutions.",
  },
];

const tools = [
  { name: "n8n", src: "/images/n8n.avif" },
  { name: "Notion", src: "/images/notion.avif" },
  { name: "Langchain", src: "/images/langchain_1.avif" },
  { name: "Apify", src: "/images/apify.avif" },
];

export default function AboutPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about-us" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      
      <Header />
      <main id="main" className="main-wrapper pt-24">
        {/* Hero Section */}
        <section className="section-about-hero">
          <div className="px-6 padding-section-large">
            <div className="container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="about-hero-content">
                  <h1 className="heading-style-h1 mb-6">
                    We make automation{" "}
                    <span className="text-brand-green">simple</span>
                  </h1>
                  <p className="text-size-large text-brand-off-white mb-8">
                    Granite Marketing helps businesses automate repetitive tasks 
                    and build intelligent workflows using no-code and low-code tools. 
                    We&apos;re obsessed with efficiency and passionate about helping 
                    teams work smarter.
                  </p>
                  <Button href="#contact-form" icon={<PlusIcon size={20} />}>
                    Work With Us
                  </Button>
                </div>
                <div className="about-hero-image relative">
                  <div className="aspect-square rounded-xl overflow-hidden gradient-border">
                    <Image
                      src="/images/454shots_so_1.avif"
                      alt="Automation workflow visualization"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-values">
          <div className="px-6 padding-section-large">
            <div className="container">
              <header className="section-header text-center mb-12 max-w-3xl mx-auto">
                <h2 className="heading-style-h2 mb-4">Our Values</h2>
                <p className="text-size-medium text-brand-off-white">
                  These principles guide everything we do, from how we build 
                  automations to how we work with clients.
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="value-card gradient-border p-8">
                    <h3 className="heading-style-h4 text-brand-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-brand-off-white">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="section-tools">
          <div className="px-6 padding-section-large">
            <div className="container">
              <header className="section-header text-center mb-12 max-w-3xl mx-auto">
                <h2 className="heading-style-h2 mb-4">Tools We Work With</h2>
                <p className="text-size-medium text-brand-off-white">
                  We specialize in the best no-code and low-code platforms on the market.
                </p>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {tools.map((tool, index) => (
                  <div
                    key={index}
                    className="tool-card flex flex-col items-center gap-4 p-6 gradient-border"
                  >
                    <div className="w-16 h-16 relative">
                      <Image
                        src={tool.src}
                        alt={tool.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-brand-white font-medium">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-cta">
          <div className="px-6 padding-section-large">
            <div className="container max-w-4xl text-center">
              <h2 className="heading-style-h2 mb-6">Ready to get started?</h2>
              <p className="text-size-medium text-brand-off-white mb-8 max-w-2xl mx-auto">
                Let&apos;s talk about how automation can transform your business. 
                Book a free discovery call today.
              </p>
              <Button href="/#contact-form" icon={<PlusIcon size={20} />}>
                Get Started
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
