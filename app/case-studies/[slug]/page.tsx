import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RichText from "@/components/ui/RichText";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/seo/JsonLd";
import { PlusIcon, ArrowLeftIcon } from "@/components/icons";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
import { getCaseStudySchema, getBreadcrumbSchema, siteConfig } from "@/lib/seo";

interface CaseStudyParams {
  params: Promise<{ slug: string }>;
}

interface CaseStudyData {
  _id: string;
  title: string;
  slug: { current: string };
  client: string;
  industry: string;
  excerpt?: string;
  challenge: Parameters<typeof RichText>[0]["value"];
  solution: Parameters<typeof RichText>[0]["value"];
  featuredImage?: {
    asset: { _ref: string };
    alt?: string;
  };
  results?: Array<{
    metric: string;
    value: string;
    description?: string;
  }>;
  images?: Array<{
    asset: { _ref: string };
    alt?: string;
    caption?: string;
  }>;
  testimonial?: {
    quote: string;
    author: string;
    company: string;
    role?: string;
    image?: { asset: { _ref: string } };
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await getCaseStudySlugs();
    return slugs.map((item: { slug: string }) => ({
      slug: item.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CaseStudyParams): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const study: CaseStudyData = await getCaseStudy(slug);

    if (!study) {
      return {
        title: "Case Study Not Found",
      };
    }

    const title = study.seo?.metaTitle || `${study.title} | Case Study`;
    const description = study.seo?.metaDescription || 
      study.excerpt || 
      `How we helped ${study.client} with ${study.industry.toLowerCase()} automation.`;
    const imageUrl = study.featuredImage 
      ? urlFor(study.featuredImage) 
      : `${siteConfig.url}${siteConfig.defaultImage}`;

    return {
      title,
      description,
      alternates: {
        canonical: `${siteConfig.url}/case-studies/${slug}`,
      },
      openGraph: {
        title,
        description,
        type: "article",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: study.featuredImage?.alt || title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "Case Study",
    };
  }
}

export default async function CaseStudyPage({ params }: CaseStudyParams) {
  const { slug } = await params;
  let study: CaseStudyData | null = null;

  try {
    study = await getCaseStudy(slug);
  } catch {
    // Sanity not configured
  }

  if (!study) {
    notFound();
  }

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Case Studies", url: "/case-studies" },
    { name: study.title, url: `/case-studies/${slug}` },
  ]);

  const caseStudySchema = getCaseStudySchema({
    title: study.title,
    description: study.excerpt || `${study.industry} automation case study for ${study.client}`,
    slug,
    client: study.client,
    industry: study.industry,
    image: study.featuredImage ? urlFor(study.featuredImage) : undefined,
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, caseStudySchema]} />
      
      <Header />
      <main id="main" className="main-wrapper pt-24">
        <article className="case-study">
          {/* Header */}
          <header className="section-case-study-header">
            <div className="px-6 padding-section-medium">
              <div className="container">
                {/* Back Link */}
                <Link
                  href="/case-studies"
                  className="inline-flex items-center gap-2 text-neutral-light hover:text-brand-white transition-colors mb-8"
                >
                  <ArrowLeftIcon size={20} />
                  Back to Case Studies
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    {/* Industry */}
                    <span className="text-sm font-medium text-brand-green uppercase tracking-wide">
                      {study.industry}
                    </span>

                    {/* Title */}
                    <h1 className="heading-style-h1 mt-2 mb-4">{study.title}</h1>

                    {/* Client */}
                    <p className="text-size-large text-brand-off-white">
                      Client: {study.client}
                    </p>
                  </div>

                  {/* Results */}
                  {study.results && study.results.length > 0 && (
                    <div className="grid grid-cols-2 gap-6">
                      {study.results.map((result, index) => (
                        <div key={index} className="gradient-border p-6 text-center">
                          <div className="text-4xl font-bold text-brand-green font-heading mb-2">
                            {result.value}
                          </div>
                          <div className="text-brand-white font-medium">
                            {result.metric}
                          </div>
                          {result.description && (
                            <p className="text-sm text-neutral-light mt-1">
                              {result.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Challenge */}
          {study.challenge && (
            <section className="section-case-study-challenge">
              <div className="px-6 padding-section-medium">
                <div className="container max-w-4xl">
                  <h2 className="heading-style-h3 mb-6 text-brand-green">
                    The Challenge
                  </h2>
                  <div className="rich-text">
                    <RichText value={study.challenge} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Solution */}
          {study.solution && (
            <section className="section-case-study-solution">
              <div className="px-6 padding-section-medium">
                <div className="container max-w-4xl">
                  <h2 className="heading-style-h3 mb-6 text-brand-green">
                    Our Solution
                  </h2>
                  <div className="rich-text">
                    <RichText value={study.solution} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Gallery */}
          {study.images && study.images.length > 0 && (
            <section className="section-case-study-gallery">
              <div className="px-6 padding-section-medium">
                <div className="container">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {study.images.map((image, index) => (
                      <figure key={index} className="rounded-xl overflow-hidden">
                        <div className="aspect-video relative">
                          <Image
                            src={urlFor(image)}
                            alt={image.alt || `Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {image.caption && (
                          <figcaption className="text-sm text-neutral-light mt-2 text-center">
                            {image.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Testimonial */}
          {study.testimonial && (
            <section className="section-case-study-testimonial">
              <div className="px-6 padding-section-medium">
                <div className="container max-w-4xl">
                  <div className="gradient-border p-8 md:p-12 text-center">
                    <blockquote className="text-xl md:text-2xl text-brand-white leading-relaxed mb-6">
                      &ldquo;{study.testimonial.quote}&rdquo;
                    </blockquote>
                    <footer className="flex items-center justify-center gap-4">
                      {study.testimonial.image && (
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={urlFor(study.testimonial.image)}
                            alt={study.testimonial.author}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="text-left">
                        <div className="text-brand-green font-medium">
                          {study.testimonial.author}
                        </div>
                        <div className="text-sm text-neutral-light font-mono">
                          {study.testimonial.role && `${study.testimonial.role}, `}
                          {study.testimonial.company}
                        </div>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="section-case-study-cta">
            <div className="px-6 padding-section-large">
              <div className="container max-w-4xl text-center">
                <h2 className="heading-style-h3 mb-4">
                  Want similar results?
                </h2>
                <p className="text-brand-off-white mb-8 max-w-2xl mx-auto">
                  Let&apos;s discuss how we can help automate your business processes 
                  and achieve measurable results.
                </p>
                <Button href="/#contact-form" icon={<PlusIcon size={20} />}>
                  Get Started
                </Button>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
