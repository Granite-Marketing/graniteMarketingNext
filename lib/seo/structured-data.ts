import { siteConfig } from "./config";

// Organization schema
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.avif`,
    description:
      "Granite Marketing helps businesses automate workflows with n8n and no-code tools to boost team efficiency and output.",
    sameAs: [
      // Add social media URLs here
      // "https://twitter.com/granitemarketing",
      // "https://linkedin.com/company/granitemarketing",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@granitemarketing.com",
      contactType: "customer service",
    },
  };
}

// Website schema
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description:
      "Custom AI Automations for Business Productivity using n8n and no-code tools.",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

// Blog post schema
export function getBlogPostSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  modifiedAt?: string;
  author?: { name: string };
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${siteConfig.url}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author?.name || siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo.avif`,
      },
    },
    image: post.image || `${siteConfig.url}${siteConfig.defaultImage}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`,
    },
  };
}

// Case study schema
export function getCaseStudySchema(study: {
  title: string;
  description: string;
  slug: string;
  client: string;
  industry: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.description,
    url: `${siteConfig.url}/case-studies/${study.slug}`,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo.avif`,
      },
    },
    image: study.image || `${siteConfig.url}${siteConfig.defaultImage}`,
    about: {
      "@type": "Thing",
      name: `${study.industry} Automation Case Study`,
    },
  };
}

// Service schema (for homepage)
export function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Workflow Automation",
    description:
      "Custom AI-powered automation solutions using n8n, Make, and other no-code tools to streamline business processes.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    serviceType: "Business Automation",
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
  };
}

// FAQ schema
export function getFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Breadcrumb schema
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

