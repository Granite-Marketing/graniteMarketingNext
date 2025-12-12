import type { Metadata } from "next";

// Site configuration
export const siteConfig = {
  name: "Granite Marketing",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://granitemarketing.com",
  locale: "en_US",
  defaultImage: "/images/og-image.jpg", // Default OG image
  twitterHandle: "@granitemarketing",
};

// Default metadata that applies to all pages
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Granite Marketing | Custom AI Automations for Business Productivity",
    template: "%s | Granite Marketing",
  },
  description:
    "Automate workflows with n8n and no-code tools to boost team efficiency and output. Discover what you can build—get started today.",
  keywords: [
    "AI automation",
    "n8n automation",
    "workflow automation",
    "no-code automation",
    "low-code automation",
    "business productivity",
    "Make.com",
    "Zapier alternative",
    "AI agents",
    "process automation",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Granite Marketing | Custom AI Automations for Business Productivity",
    description:
      "Automate workflows with n8n and no-code tools to boost team efficiency and output. Discover what you can build—get started today.",
    images: [
      {
        url: siteConfig.defaultImage,
        width: 1200,
        height: 630,
        alt: "Granite Marketing - AI Automation Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: "Granite Marketing | Custom AI Automations for Business Productivity",
    description:
      "Automate workflows with n8n and no-code tools to boost team efficiency and output. Discover what you can build—get started today.",
    images: [siteConfig.defaultImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/favicon.png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/images/webclip.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteConfig.url,
  },
};

// Static page metadata
export const pageMetadata = {
  home: {
    title: "Granite Marketing | Custom AI Automations for Business Productivity",
    description:
      "Automate workflows with n8n and no-code tools to boost team efficiency and output. Discover what you can build—get started today.",
  },
  about: {
    title: "About Us | AI Automation with n8n & Low-Code Tools",
    description:
      "We build flexible, AI-powered systems to reduce busywork and scale smarter. Learn how we work and start your automation journey now.",
  },
  contact: {
    title: "Contact Us | Start Your Automation Project",
    description:
      "Have a project in mind or a workflow to improve? Reach out to discuss your automation goals. Book a call or send us a message today.",
  },
  blog: {
    title: "Blog | N8n News, Updates and Automation Insights",
    description:
      "Stay tuned for latest advancements in automations, feature releases in n8n and everything in between.",
  },
  caseStudies: {
    title: "Case Studies | Real Results from Real Automations",
    description:
      "See how we've helped businesses transform their operations with custom automation solutions. Real case studies with measurable results.",
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "Learn how Granite Marketing collects, uses, and protects your personal information.",
  },
  cookies: {
    title: "Cookie Policy",
    description:
      "Learn about how Granite Marketing uses cookies and similar technologies.",
  },
};

// Helper to generate page metadata
export function generatePageMetadata(
  page: keyof typeof pageMetadata,
  overrides?: Partial<Metadata>
): Metadata {
  const pageMeta = pageMetadata[page];
  
  return {
    title: pageMeta.title,
    description: pageMeta.description,
    openGraph: {
      title: pageMeta.title,
      description: pageMeta.description,
      url: `${siteConfig.url}/${page === "home" ? "" : page.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
      images: [
        {
          url: siteConfig.defaultImage,
          width: 1200,
          height: 630,
          alt: pageMeta.title,
        },
      ],
    },
    twitter: {
      title: pageMeta.title,
      description: pageMeta.description,
    },
    ...overrides,
  };
}

