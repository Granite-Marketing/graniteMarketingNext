import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RichText from "@/components/ui/RichText";
import JsonLd from "@/components/seo/JsonLd";
import { ArrowLeftIcon } from "@/components/icons";
import { getBlogPost, getBlogPostSlugs } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
import { getBlogPostSchema, getBreadcrumbSchema, siteConfig } from "@/lib/seo";

interface BlogPostParams {
  params: Promise<{ slug: string }>;
}

interface BlogPostData {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  content: Parameters<typeof RichText>[0]["value"];
  publishedAt: string;
  updatedAt?: string;
  featuredImage?: {
    asset: { _ref: string };
    alt?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  categories?: Array<{
    _id: string;
    name: string;
    slug: { current: string };
  }>;
  author?: {
    name: string;
    image?: { asset: { _ref: string } };
    bio?: string;
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await getBlogPostSlugs();
    return slugs.map((item: { slug: string }) => ({
      slug: item.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostParams): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const post: BlogPostData = await getBlogPost(slug);
    
    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    const title = post.seo?.metaTitle || post.title;
    const description = post.seo?.metaDescription || post.excerpt;
    const imageUrl = post.featuredImage 
      ? urlFor(post.featuredImage) 
      : `${siteConfig.url}${siteConfig.defaultImage}`;

    return {
      title,
      description,
      alternates: {
        canonical: `${siteConfig.url}/blog/${slug}`,
      },
      openGraph: {
        title,
        description,
        type: "article",
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt || post.publishedAt,
        authors: post.author ? [post.author.name] : [siteConfig.name],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.featuredImage?.alt || title,
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
      title: "Blog Post",
    };
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostParams) {
  const { slug } = await params;
  let post: BlogPostData | null = null;

  try {
    post = await getBlogPost(slug);
  } catch {
    // Sanity not configured
  }

  if (!post) {
    notFound();
  }

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ]);

  const blogPostSchema = getBlogPostSchema({
    title: post.title,
    description: post.excerpt,
    slug: slug,
    publishedAt: post.publishedAt,
    modifiedAt: post.updatedAt,
    author: post.author,
    image: post.featuredImage ? urlFor(post.featuredImage) : undefined,
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, blogPostSchema]} />
      
      <Header />
      <main id="main" className="main-wrapper pt-24">
        <article className="blog-post">
          {/* Header */}
          <header className="section-blog-header">
            <div className="px-6 padding-section-medium">
              <div className="container max-w-3xl">
                {/* Back Link */}
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-neutral-light hover:text-brand-white transition-colors mb-8"
                >
                  <ArrowLeftIcon size={20} />
                  Back to Blog
                </Link>

                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {post.categories.map((category) => (
                      <span
                        key={category._id}
                        className="text-sm font-medium text-brand-green uppercase tracking-wide"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="heading-style-h1 mb-6">{post.title}</h1>

                {/* Meta */}
                <div className="flex items-center gap-4 text-neutral-light">
                  {post.author && (
                    <span className="text-brand-white">{post.author.name}</span>
                  )}
                  <span>•</span>
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="section-blog-image">
              <div className="px-6">
                <div className="container max-w-4xl">
                  <div className="aspect-video relative rounded-xl overflow-hidden">
                    <Image
                      src={urlFor(post.featuredImage)}
                      alt={post.featuredImage.alt || post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <section className="section-blog-content">
            <div className="px-6 padding-section-medium">
              <div className="container max-w-3xl">
                {post.content && <RichText value={post.content} />}
              </div>
            </div>
          </section>

          {/* Author */}
          {post.author && (
            <section className="section-blog-author">
              <div className="px-6 padding-section-small">
                <div className="container max-w-3xl">
                  <div className="border-t border-neutral-dark pt-8">
                    <div className="flex items-center gap-4">
                      {post.author.image && (
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-darker">
                          <Image
                            src={urlFor(post.author.image)}
                            alt={post.author.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-brand-white">
                          {post.author.name}
                        </div>
                        {post.author.bio && (
                          <p className="text-sm text-neutral-light">
                            {post.author.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
