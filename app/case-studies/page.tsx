import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getCaseStudies } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
import { generatePageMetadata, getBreadcrumbSchema, siteConfig } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("caseStudies", {
  alternates: {
    canonical: `${siteConfig.url}/case-studies`,
  },
});

interface CaseStudy {
  _id: string;
  title: string;
  slug: { current: string };
  client: string;
  industry: string;
  excerpt: string;
  featuredImage?: {
    asset: { _ref: string };
    alt?: string;
  };
  results?: Array<{
    metric: string;
    value: string;
    description?: string;
  }>;
}

// Placeholder case studies for when Sanity is not configured
const placeholderCaseStudies: CaseStudy[] = [
  {
    _id: "1",
    title: "Content Publishing Automation for SaaS Startup",
    slug: { current: "content-publishing-automation" },
    client: "TechFlow Solutions",
    industry: "SaaS",
    excerpt: "How we helped a growing SaaS company automate their content pipeline and 10x their blog output.",
    results: [
      { metric: "Time Saved", value: "40h/week" },
      { metric: "Content Output", value: "10x" },
    ],
  },
  {
    _id: "2",
    title: "Lead Generation Workflow for Marketing Agency",
    slug: { current: "lead-generation-workflow" },
    client: "Growth Labs",
    industry: "Marketing",
    excerpt: "Building an automated lead generation and nurturing system that runs on autopilot.",
    results: [
      { metric: "Lead Increase", value: "300%" },
      { metric: "Response Time", value: "-80%" },
    ],
  },
  {
    _id: "3",
    title: "AI Research Assistant for Consulting Firm",
    slug: { current: "ai-research-assistant" },
    client: "Strategy Partners",
    industry: "Consulting",
    excerpt: "Creating an AI-powered research assistant that saves analysts hours of manual research.",
    results: [
      { metric: "Research Time", value: "-60%" },
      { metric: "Report Quality", value: "+40%" },
    ],
  },
];

// Case studies listing schema
function getCaseStudiesListSchema(studies: CaseStudy[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Granite Marketing Case Studies",
    description: "Real results from real automations. See how we've helped businesses transform their operations.",
    url: `${siteConfig.url}/case-studies`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: studies.length,
      itemListElement: studies.map((study, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteConfig.url}/case-studies/${study.slug.current}`,
        name: study.title,
      })),
    },
  };
}

export default async function CaseStudiesPage() {
  let caseStudies: CaseStudy[] = [];

  try {
    caseStudies = await getCaseStudies();
  } catch {
    // Use placeholder data if Sanity is not configured
    caseStudies = placeholderCaseStudies;
  }

  if (caseStudies.length === 0) {
    caseStudies = placeholderCaseStudies;
  }

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Case Studies", url: "/case-studies" },
  ]);

  return (
    <>
      <JsonLd data={[breadcrumbs, getCaseStudiesListSchema(caseStudies)]} />
      
      <Header />
      <main id="main" className="main-wrapper pt-24">
        {/* Hero Section */}
        <section className="section-case-studies-hero">
          <div className="px-6 padding-section-medium">
            <div className="container">
              <header className="text-center max-w-3xl mx-auto">
                <h1 className="heading-style-h1 mb-4">Case Studies</h1>
                <p className="text-size-large text-brand-off-white">
                  Real results from real automations. See how we&apos;ve helped 
                  businesses transform their operations.
                </p>
              </header>
            </div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="section-case-studies-grid">
          <div className="px-6 padding-section-large">
            <div className="container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {caseStudies.map((study) => (
                  <article
                    key={study._id}
                    className="case-study-card gradient-border p-0 overflow-hidden group"
                  >
                    <Link href={`/case-studies/${study.slug.current}`} className="block">
                      {/* Image */}
                      <div className="aspect-video relative bg-neutral-darker">
                        {study.featuredImage ? (
                          <Image
                            src={urlFor(study.featuredImage)}
                            alt={study.featuredImage.alt || study.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-neutral-light">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Industry Tag */}
                        <span className="text-xs font-medium text-brand-green uppercase tracking-wide">
                          {study.industry}
                        </span>

                        {/* Title */}
                        <h2 className="heading-style-h4 text-brand-white mt-2 mb-2 group-hover:text-brand-green transition-colors">
                          {study.title}
                        </h2>

                        {/* Client */}
                        <p className="text-sm text-neutral-light mb-4">
                          {study.client}
                        </p>

                        {/* Excerpt */}
                        <p className="text-brand-off-white mb-6 line-clamp-2">
                          {study.excerpt}
                        </p>

                        {/* Results */}
                        {study.results && study.results.length > 0 && (
                          <div className="flex gap-6 border-t border-neutral-dark pt-4">
                            {study.results.slice(0, 2).map((result, index) => (
                              <div key={index}>
                                <div className="text-2xl font-bold text-brand-green font-heading">
                                  {result.value}
                                </div>
                                <div className="text-sm text-neutral-light">
                                  {result.metric}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
