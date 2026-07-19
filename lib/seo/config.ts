import type { Metadata } from "next";
import { stegaClean } from "next-sanity";
import { urlForImage } from "@/lib/sanity/client";
import { getSiteSettings } from "@/lib/sanity/queries";

// Site configuration
export const siteConfig = {
  name: "Granite Marketing",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.granitemarketing.co.uk",
  locale: "en_GB",
  defaultImage: "/images/og-image.png", // Default OG image
  twitterHandle: "@granitemarketing",
};

// The hardcoded title/description/OG-image this module has always shipped
// with. Named here — rather than only inline inside `defaultMetadata` below
// — so getRootMetadata's per-field Sanity fallback (further down this file)
// reuses these EXACT values instead of re-deriving them by reflecting on
// the already-assembled `Metadata` object. One value, two call sites, no
// risk of the two drifting apart.
const DEFAULT_TITLE = "Granite Marketing | Custom AI Automations for Business Productivity";
const DEFAULT_TITLE_TEMPLATE = "%s | Granite Marketing";
const DEFAULT_DESCRIPTION =
  "Automate workflows with n8n and no-code tools to boost team efficiency and output. Discover what you can build—get started today.";
const DEFAULT_OG_IMAGE = {
  url: siteConfig.defaultImage,
  width: 1200,
  height: 630,
  alt: "Granite Marketing - AI Automation Services",
};

// Default metadata that applies to all pages
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: DEFAULT_TITLE,
    template: DEFAULT_TITLE_TEMPLATE,
  },
  description: DEFAULT_DESCRIPTION,
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
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
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
  verification: {
    google: "sT8enJIMDY94t6hT4Dj10Ee8b0wXtH0uXSSHv1XMqdw",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
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

// -----------------------------------------------------------------------
// Sanity-driven overrides — siteSettings' four SEO/social fields (U9's
// schema, lib/sanity/studio-schemas/documents/siteSettings.ts) driving the
// hardcoded defaults above. Every field falls back to its own DEFAULT_*
// constant independently: an editor filling in just `siteTitle` must not
// blank the description or drop the OG image. Mirrors app/page.tsx's
// generateMetadata, the per-page equivalent of this same fallback rule.
// -----------------------------------------------------------------------

/** siteSettings' `ogImage` field, narrowed to what this module reads —
 * structural rather than imported from `sanity.types`, matching
 * components/brand-mark.tsx's `SiteSettingsLogoField` convention. */
type SiteSettingsOgImage = {
  asset?: unknown;
  altText?: string | null;
} | null | undefined;

/** siteSettings' `favicon` field, narrowed the same way. */
type SiteSettingsFavicon = { asset?: unknown } | null | undefined;

/**
 * This file has always declared FOUR icon entries (an SVG, favicon.png,
 * 32x32, 16x16) plus an Apple webclip. siteSettings.ts's `favicon` field is
 * deliberately a single square upload rather than five separate ones — see
 * that field's comment for why — so every raster size below is DERIVED
 * from it via the image URL builder's width/height rather than uploaded
 * separately. The SVG entry can never come from Sanity (its image pipeline
 * transforms raster formats; it cannot emit an SVG from a PNG/JPEG upload)
 * and stays hardcoded regardless of what an editor uploads.
 */
function buildIconsFromFavicon(favicon: SiteSettingsFavicon): Metadata["icons"] | undefined {
  if (!favicon?.asset) return undefined;

  const source = urlForImage(favicon.asset as never);

  return {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: source.width(48).height(48).format("png").url() },
      {
        url: source.width(32).height(32).format("png").url(),
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: source.width(16).height(16).format("png").url(),
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: source.width(180).height(180).format("png").url(),
        sizes: "180x180",
      },
    ],
  };
}

/** Builds the OG/Twitter share image, falling back to DEFAULT_OG_IMAGE
 * (untouched, same object) when no `ogImage` has been uploaded.
 * `fallbackAlt` is only used when an image IS uploaded but its `altText`
 * was left blank — an unset ogImage never reaches this branch at all. */
function buildOgImage(
  ogImage: SiteSettingsOgImage,
  fallbackAlt: string
): { url: string; width: number; height: number; alt: string } {
  if (!ogImage?.asset) return DEFAULT_OG_IMAGE;

  return {
    url: urlForImage(ogImage.asset as never).width(1200).height(630).format("png").url(),
    width: 1200,
    height: 630,
    alt: ogImage.altText || fallbackAlt,
  };
}

/**
 * The root layout's metadata (app/layout.tsx), Sanity-aware. Each of
 * siteSettings' four SEO fields overrides its own hardcoded default
 * independently; an unset field — including the whole document being
 * unpublished, which is the case today (these fields currently exist only
 * on a DRAFT) — falls all the way back to the literal values above, so
 * this must produce metadata byte-identical to the old static
 * `defaultMetadata` export whenever nothing has been filled in.
 *
 * stegaClean strips the invisible click-to-edit characters before they can
 * reach a <title> or <meta> tag — see app/page.tsx's generateMetadata for
 * the same rule applied to per-page SEO. Never applied to rendered copy,
 * only to metadata.
 */
export async function getRootMetadata(): Promise<Metadata> {
  const settings = stegaClean(await getSiteSettings());

  const title = settings?.siteTitle || DEFAULT_TITLE;
  const description = settings?.siteDescription || DEFAULT_DESCRIPTION;
  const ogImage = buildOgImage(settings?.ogImage, title);
  const icons = buildIconsFromFavicon(settings?.favicon) ?? defaultMetadata.icons;

  return {
    ...defaultMetadata,
    title: {
      // Only the DEFAULT title moves. siteTitle's schema description calls
      // it "the site-wide default page title" — the homepage/site-name
      // title, not the brand suffix. The TEMPLATE ("%s | Granite
      // Marketing") stays hardcoded: it's what every OTHER page's <title>
      // is built from (generatePageMetadata below, app/page.tsx's own
      // generateMetadata), so folding siteTitle into it too would mean a
      // single Studio edit silently rewrites every page's title on the
      // site, not just the homepage's — a far bigger blast radius than the
      // field's own description implies.
      default: title,
      template: DEFAULT_TITLE_TEMPLATE,
    },
    description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: [ogImage.url],
    },
    icons,
  };
}

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
  terms: {
    title: "Terms of Service",
    description:
      "Terms of service for Granite Marketing's AI workflow automation services.",
  },
  refundPolicy: {
    title: "Refund & Cancellation Policy",
    description:
      "Refund and cancellation policy for Granite Marketing's services.",
  },
  deliveryPolicy: {
    title: "Delivery Policy",
    description:
      "Service delivery policy for Granite Marketing's AI workflow automation services.",
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

