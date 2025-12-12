import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getBlogPosts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
import { generatePageMetadata, getBreadcrumbSchema, siteConfig } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("blog", {
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
});

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  featuredImage?: {
    asset: { _ref: string };
    alt?: string;
  };
  categories?: Array<{
    _id: string;
    name: string;
    slug: { current: string };
  }>;
  author?: {
    name: string;
    image?: { asset: { _ref: string } };
  };
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Placeholder posts for when Sanity is not configured
const placeholderPosts: BlogPost[] = [
  {
    _id: "1",
    title: "Getting Started with n8n: A Complete Guide",
    slug: { current: "getting-started-n8n" },
    excerpt: "Learn how to set up and configure n8n for your first automation project. This comprehensive guide covers everything from installation to your first workflow.",
    publishedAt: "2024-12-01",
    categories: [{ _id: "1", name: "n8n", slug: { current: "n8n" } }],
  },
  {
    _id: "2",
    title: "10 Automation Ideas for Small Businesses",
    slug: { current: "automation-ideas-small-business" },
    excerpt: "Discover practical automation ideas that can help small businesses save time and reduce manual work. From email workflows to CRM updates.",
    publishedAt: "2024-11-28",
    categories: [{ _id: "2", name: "Business", slug: { current: "business" } }],
  },
  {
    _id: "3",
    title: "AI Agents: The Future of Business Automation",
    slug: { current: "ai-agents-future-automation" },
    excerpt: "Explore how AI agents are transforming business processes and what this means for the future of work and productivity.",
    publishedAt: "2024-11-20",
    categories: [{ _id: "3", name: "AI", slug: { current: "ai" } }],
  },
];

// Blog listing schema
function getBlogListSchema(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Granite Marketing Blog",
    description: "N8n News, Updates and Automation Insights",
    url: `${siteConfig.url}/blog`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug.current}`,
      datePublished: post.publishedAt,
    })),
  };
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  
  try {
    posts = await getBlogPosts();
  } catch {
    // Use placeholder posts if Sanity is not configured
    posts = placeholderPosts;
  }

  if (posts.length === 0) {
    posts = placeholderPosts;
  }

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  return (
    <>
      <JsonLd data={[breadcrumbs, getBlogListSchema(posts)]} />
      
      <Header />
      <main id="main" className="main-wrapper pt-24">
        {/* Hero Section */}
        <section className="section-blog-hero">
          <div className="px-6 padding-section-medium">
            <div className="container">
              <header className="text-center max-w-3xl mx-auto">
                <h1 className="heading-style-h1 mb-4">Blog</h1>
                <p className="text-size-large text-brand-off-white">
                  Stay tuned for the latest advancements in automations, feature 
                  releases in n8n, and everything in between.
                </p>
              </header>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="section-blog-grid">
          <div className="px-6 padding-section-large">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article key={post._id} className="blog-card group">
                    <Link href={`/blog/${post.slug.current}`} className="block">
                      {/* Image */}
                      <div className="aspect-video relative rounded-lg overflow-hidden mb-4 bg-neutral-darker">
                        {post.featuredImage ? (
                          <Image
                            src={urlFor(post.featuredImage)}
                            alt={post.featuredImage.alt || post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-neutral-light">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Categories */}
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {post.categories.map((category) => (
                            <span
                              key={category._id}
                              className="text-xs font-medium text-brand-green uppercase tracking-wide"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="heading-style-h4 text-brand-white mb-2 group-hover:text-brand-green transition-colors">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-brand-off-white line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>

                      {/* Date */}
                      <time
                        dateTime={post.publishedAt}
                        className="text-sm text-neutral-light"
                      >
                        {formatDate(post.publishedAt)}
                      </time>
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
