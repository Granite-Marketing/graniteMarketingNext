import { defineQuery } from "next-sanity";
import { client } from "./client";
import { fetchQuery } from "./lib/fetch";
import { adaptCaseStudyToCard } from "./lib/adapters";

// =============================================================================
// BLOG POSTS
// =============================================================================

// U5 of the Sanity page builder plan: every query string below is wrapped in
// `defineQuery` and assigned to a uniquely named top-level const. Both
// failure modes are silent — an inline `client.fetch(groq\`...\`)` is
// skipped by typegen entirely, and a variable name reused in another file
// silently overwrites this one's generated type — so names are namespaced
// per query rather than reused across functions.

export const BLOG_POSTS_QUERY = defineQuery(`
    *[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      featuredImage,
      categories[]-> {
        _id,
        name,
        slug
      },
      author-> {
        name,
        image
      }
    }
  `);

export async function getBlogPosts() {
	return fetchQuery(BLOG_POSTS_QUERY, {});
}

export const BLOG_POST_QUERY = defineQuery(`
    *[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      "updatedAt": _updatedAt,
      featuredImage,
      categories[]-> {
        _id,
        name,
        slug
      },
      author-> {
        name,
        image,
        bio
      },
      seo {
        metaTitle,
        metaDescription
      },
      "relatedTemplates": *[_type == "workflowTemplate" && references(^._id)] {
        _id,
        title,
        slug,
        n8nUrl,
        youtubeUrl
      },
      standaloneTemplateLink {
        n8nUrl,
        youtubeUrl
      }
    }
  `);

export async function getBlogPost(slug?: string) {
	if (!slug) {
		return null;
	}

	return fetchQuery(BLOG_POST_QUERY, { slug });
}

export const BLOG_POST_SLUGS_QUERY = defineQuery(`
    *[_type == "blogPost"].slug.current
  `);

export async function getBlogPostSlugs() {
	const slugs = await fetchQuery<string[]>(
		BLOG_POST_SLUGS_QUERY,
		{},
		// Static params must never include draft-only posts.
		{ forcePublished: true }
	);
	return slugs.map((slug) => ({ slug }));
}

export const FEATURED_BLOG_POSTS_QUERY = defineQuery(`
    *[_type == "blogPost" && featured == true] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featuredImage {
        asset,
        alt
      }
    }
  `);

export async function getFeaturedBlogPosts(limit = 3) {
	return fetchQuery(FEATURED_BLOG_POSTS_QUERY, { limit });
}

export const BLOG_POSTS_BY_CATEGORY_QUERY = defineQuery(`
    *[_type == "blogPost" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featuredImage {
        asset,
        alt
      },
      categories[]-> {
        _id,
        name,
        slug
      }
    }
  `);

export async function getBlogPostsByCategory(categorySlug: string) {
	return fetchQuery(BLOG_POSTS_BY_CATEGORY_QUERY, { categorySlug });
}

// =============================================================================
// WORKFLOW TEMPLATES
// =============================================================================

export const WORKFLOW_TEMPLATES_QUERY = defineQuery(`
    *[_type == "workflowTemplate"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      featured,
      sortOrder,
      featuredImage,
      "workflowJsonUrl": workflowJson.asset->url,
      n8nUrl,
      youtubeUrl,
      loomUrl,
      railwayTemplates[]{
        label,
        deployUrl
      },
      categories[]-> {
        _id,
        name,
        slug
      },
      author-> {
        name,
        image
      }
    }
  `);

export async function getWorkflowTemplates() {
	return fetchQuery(WORKFLOW_TEMPLATES_QUERY, {});
}

export const WORKFLOW_TEMPLATE_QUERY = defineQuery(`
    *[_type == "workflowTemplate" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      "updatedAt": _updatedAt,
      featuredImage,
      "workflowJsonUrl": workflowJson.asset->url,
      n8nUrl,
      youtubeUrl,
      loomUrl,
      railwayTemplates[]{
        label,
        deployUrl
      },
      categories[]-> {
        _id,
        name,
        slug
      },
      author-> {
        name,
        image,
        bio
      },
      relatedBlogPosts[]-> {
        _id,
        title,
        slug,
        excerpt,
        featuredImage,
        publishedAt,
        content,
        categories[]-> { _id, name, slug }
      },
      seo {
        metaTitle,
        metaDescription
      }
    }
  `);

export async function getWorkflowTemplate(slug?: string) {
	if (!slug) {
		return null;
	}

	return fetchQuery(WORKFLOW_TEMPLATE_QUERY, { slug });
}

export const WORKFLOW_TEMPLATE_SLUGS_QUERY = defineQuery(`
    *[_type == "workflowTemplate"].slug.current
  `);

export async function getWorkflowTemplateSlugs() {
	const slugs = await fetchQuery<string[]>(
		WORKFLOW_TEMPLATE_SLUGS_QUERY,
		{},
		// Static params must never include draft-only templates.
		{ forcePublished: true }
	);
	return slugs.map((slug) => ({ slug }));
}

// =============================================================================
// CASE STUDIES
// =============================================================================

export const CASE_STUDIES_QUERY = defineQuery(`
    *[_type == "caseStudy"] | order(sortOrder asc, _createdAt desc) {
      _id,
      title,
      slug,
      client->{
        _id,
        name,
        company
      },
      industry->{
        _id,
        name,
        slug,
        country,
        region
      },
      excerpt,
      featuredImage {
        asset,
        alt
      },
      loomUrl,
      techStack[]->{
        _id,
        name,
        slug,
        integrationType
      },
      showOnHome,
      results[] {
        metric,
        value,
        description
      }
    }
  `);

export async function getCaseStudies() {
	return fetchQuery(CASE_STUDIES_QUERY, {});
}

export const CASE_STUDY_QUERY = defineQuery(`
    *[_type == "caseStudy" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      client->{
        _id,
        name,
        company
      },
      industry->{
        _id,
        name,
        slug,
        country,
        region
      },
      excerpt,
      challenge,
      solution,
      featuredImage {
        asset,
        alt
      },
      results[] {
        metric,
        value,
        description
      },
      techStack[]->{
        _id,
        name,
        slug,
        integrationType,
        description,
        logo{
          asset,
          alt
        }
      },
      images[] {
        asset,
        alt,
        caption
      },
      testimonial-> {
        name,
        authorName,
        company,
        testimonial,
        headshot {
          asset
        }
      },
      techStack[] {
        title,
        description,
        image {
          asset,
          alt
        },
        integrationType
      },
      loomUrl,
      seo {
        metaTitle,
        metaDescription
      }
    }
  `);

export async function getCaseStudy(slug: string) {
	return fetchQuery(CASE_STUDY_QUERY, { slug });
}

export const CASE_STUDY_SLUGS_QUERY = defineQuery(`
    *[_type == "caseStudy"] | order(sortOrder asc, _createdAt desc).slug.current
  `);

export async function getCaseStudySlugs() {
	const slugs = await fetchQuery<string[]>(
		CASE_STUDY_SLUGS_QUERY,
		{},
		// Static params must never include draft-only case studies.
		{ forcePublished: true }
	);
	return slugs.map((slug) => ({ slug }));
}

// =============================================================================
// CATEGORIES
// =============================================================================

export const CATEGORIES_QUERY = defineQuery(`
    *[_type == "category"] | order(name asc) {
      _id,
      name,
      slug,
      description
    }
  `);

export async function getCategories() {
	return fetchQuery(CATEGORIES_QUERY, {});
}

export const CATEGORY_QUERY = defineQuery(`
    *[_type == "category" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      description
    }
  `);

export async function getCategory(slug: string) {
	return fetchQuery(CATEGORY_QUERY, { slug });
}

// =============================================================================
// CLIENTS (TESTIMONIALS)
// =============================================================================

export const CLIENTS_QUERY = defineQuery(`
    *[_type == "client"] | order(dateStarted desc) {
      _id,
      name,
      slug,
      authorName,
      company,
      role,
      testimonial,
      companyLogo {
        asset,
        alt
      },
      headshot {
        asset,
        alt
      },
      location-> {
        name,
        slug
      }
    }
  `);

export async function getClients() {
	return fetchQuery(CLIENTS_QUERY, {});
}

export const CLIENT_QUERY = defineQuery(`
    *[_type == "client" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      authorName,
      company,
      role,
      testimonial,
      dateStarted,
      companyLogo {
        asset,
        alt
      },
      headshot {
        asset,
        alt
      },
      location-> {
        name,
        slug
      }
    }
  `);

export async function getClient(slug: string) {
	return fetchQuery(CLIENT_QUERY, { slug });
}

// =============================================================================
// FAQs
// =============================================================================

// The original implementation built the query string with JS interpolation
// (`*[_type == "faq"${categoryFilter}]`), conditionally including the
// category clause. Typegen statically parses the AST of a `defineQuery(...)`
// call and cannot resolve a runtime-interpolated segment — it needs one
// static GROQ string. Rewritten as a single query that always accepts
// `$category` and treats an undefined/null value as "no filter" via GROQ's
// own `defined()`, which is behaviourally equivalent to the old branch and
// keeps the query typeable.
export const FAQS_QUERY = defineQuery(`
    *[_type == "faq" && (!defined($category) || category == $category)] | order(order asc) {
      _id,
      question,
      slug,
      answer,
      order,
      category
    }
  `);

export async function getFAQs(category?: string) {
	return fetchQuery(FAQS_QUERY, { category: category ?? null });
}

export const FAQ_QUERY = defineQuery(`
    *[_type == "faq" && slug.current == $slug][0] {
      _id,
      question,
      slug,
      answer,
      category
    }
  `);

export async function getFAQ(slug: string) {
	return fetchQuery(FAQ_QUERY, { slug });
}

// =============================================================================
// LOCATIONS
// =============================================================================

export const LOCATIONS_QUERY = defineQuery(`
    *[_type == "location"] | order(name asc) {
      _id,
      name,
      slug,
      country,
      region
    }
  `);

export async function getLocations() {
	return fetchQuery(LOCATIONS_QUERY, {});
}

// =============================================================================
// LOGO LIST
// =============================================================================

export const LOGO_LIST_QUERY = defineQuery(`
    *[_type == "logoList"] | order(sortOrder asc) {
      _id,
      clientName,
      slug,
      logo {
        asset,
        alt
      },
      sortOrder,
      website,
      featured
    }
  `);

export async function getLogoList() {
	return fetchQuery(LOGO_LIST_QUERY, {});
}

export const FEATURED_LOGOS_QUERY = defineQuery(`
    *[_type == "logoList" && featured == true] | order(sortOrder asc) [0...$limit] {
      _id,
      clientName,
      slug,
      logo {
        asset,
        alt
      },
      website
    }
  `);

export async function getFeaturedLogos(limit = 10) {
	return fetchQuery(FEATURED_LOGOS_QUERY, { limit });
}

// =============================================================================
// TOOLS
// =============================================================================

export const TOOLS_QUERY = defineQuery(`
    *[_type == "tool"] | order(name asc) {
      _id,
      name,
      slug,
      integrationType,
      description,
      logo {
        asset,
        alt
      },
      website
    }
  `);

export async function getTools() {
	return fetchQuery(TOOLS_QUERY, {});
}

// =============================================================================
// AUTHORS
// =============================================================================

export const AUTHORS_QUERY = defineQuery(`
    *[_type == "author"] | order(name asc) {
      _id,
      name,
      slug,
      image,
      bio,
      role,
      social
    }
  `);

export async function getAuthors() {
	return fetchQuery(AUTHORS_QUERY, {});
}

export const AUTHOR_QUERY = defineQuery(`
    *[_type == "author" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      image,
      bio,
      role,
      social
    }
  `);

export async function getAuthor(slug: string) {
	return fetchQuery(AUTHOR_QUERY, { slug });
}

// =============================================================================
// COMPOSED HELPERS FOR MARKETING PAGES
// =============================================================================

export const HOMEPAGE_CASE_STUDIES_QUERY = defineQuery(`
    *[_type == "caseStudy" && showOnHome == true]
      | order(sortOrder asc, _createdAt desc) [0...$limit]{
      _id,
      title,
      slug,
      client->{
        _id,
        name,
        company
      },
      industry->{
        _id,
        name,
        slug,
        country,
        region
      },
      excerpt,
      featuredImage{
        asset,
        alt
      },
      loomUrl,
      techStack[]->{
        _id,
        name,
        slug,
        integrationType
      },
      results[]{
        metric,
        value,
        description
      }
    }
  `);

export async function getHomepageCaseStudies(limit = 24) {
	const docs: any[] = await fetchQuery(HOMEPAGE_CASE_STUDIES_QUERY, { limit });

	return docs.map((doc) => adaptCaseStudyToCard(doc));
}

export async function getHomeContent() {
	const [featuredLogos, testimonials, faqs, caseStudies] = await Promise.all([
		getFeaturedLogos(10),
		getClients(),
		getFAQs("general"),
		getHomepageCaseStudies(),
	]);

	return {
		featuredLogos,
		testimonials,
		faqs,
		caseStudies,
	};
}

// =============================================================================
// PAGE BUILDER (U13 of the Sanity page builder plan)
// =============================================================================

// Shared by every labelled-link field projected below (ctaButton,
// secondaryCta, the capabilities footer link, hero's secondary CTA) —
// dereferences `internalRef`/`anchorPage` with exactly the shape
// lib/sanity/lib/resolve-link.ts's `LinkValue` needs to discriminate on.
// Mirrors siteSettings.ts's own (non-exported) `LINK_PROJECTION` field for
// field, since resolve-link.ts is the single resolver both must feed.
const PAGE_BUILDER_LINK_FIELDS = `{
    linkType,
    internalRef->{ _type, _id, slug },
    anchorPage->{ _type, _id, slug },
    anchorId,
    href,
    openInNewTab
  }`;

const PAGE_BUILDER_LABELED_LINK_FIELDS = `{
    label,
    link ${PAGE_BUILDER_LINK_FIELDS}
  }`;

// The case-study projection duplicates CASE_STUDIES_QUERY's shape exactly
// (client/industry/techStack dereferenced, results as {metric,value}) since
// both `autoItems` and `manualItems` below feed the same
// `adaptCaseStudyToCard` adapter results.tsx already renders through.
const PAGE_BUILDER_CASE_STUDY_FIELDS = `{
    _id,
    title,
    slug,
    client->{ _id, name, company },
    industry->{ _id, name, slug, country, region },
    excerpt,
    featuredImage{ asset, alt },
    loomUrl,
    techStack[]->{ _id, name, slug, integrationType },
    results[]{ metric, value, description }
  }`;

const PAGE_BUILDER_CLIENT_FIELDS = `{
    _id,
    name,
    authorName,
    company,
    role,
    testimonial,
    headshot{ asset, alt },
    companyLogo{ asset, alt },
    location->{ name }
  }`;

const PAGE_BUILDER_FAQ_FIELDS = `{
    _id,
    question,
    slug,
    answer,
    order,
    category
  }`;

// U13's `sections[]` projection: `_key` on every element (KTD5 — data
// attribute paths target `_key`, never index, so an item silently pointing
// at the wrong section the moment an editor reorders is a query bug, not a
// renderer bug), then one `_type == "…" => {...}` branch per block (U12).
//
// Data blocks (toolsStripBlock, resultsBlock, testimonialsBlock, faqBlock)
// project BOTH `autoItems` and `manualItems` unconditionally rather than
// branching on `sourceMode` in GROQ — lib/sanity/lib/resolve-data-block.ts
// is the single place that picks between them, and it already handles an
// unset/unrecognised `sourceMode` by treating it as `"auto"`. faqBlock's
// `autoItems` is fetched unfiltered (every FAQ, not just `autoCategory`'s
// match) and filtered client-side in the block adapter instead of in GROQ:
// GROQ's `^` parent-scope operator inside a `*[...]` subquery does not
// reliably reach a sibling field on the *object being constructed* the way
// it reaches an enclosing *document* scope, so filtering here would be
// resting typegen-verified behaviour on an unverified GROQ scoping rule.
export const PAGE_QUERY = defineQuery(`
    *[_type == "page" && slug.current == $slug][0] {
      _id,
      _type,
      title,
      slug,
      seo {
        metaTitle,
        metaDescription
      },
      sections[] {
        _key,
        _type,
        anchorId,

        _type == "heroBlock" => {
          eyebrow,
          heading,
          body,
          primaryCtaLabel,
          secondaryCta ${PAGE_BUILDER_LABELED_LINK_FIELDS},
          showTrustedBy
        },

        _type == "capabilitiesBlock" => {
          eyebrow,
          heading,
          body,
          items[]{
            _key,
            tag,
            title,
            description,
            featured,
            snippet
          },
          link ${PAGE_BUILDER_LABELED_LINK_FIELDS}
        },

        _type == "toolsStripBlock" => {
          eyebrow,
          heading,
          intro,
          sourceMode,
          "autoItems": *[_type == "tool"] | order(name asc) {
            _id,
            name,
            logo{ asset, alt }
          },
          "manualItems": manualTools[]->{
            _id,
            name,
            logo{ asset, alt }
          }
        },

        _type == "processBlock" => {
          eyebrow,
          heading,
          body,
          steps[]{
            _key,
            stepLabel,
            title,
            description,
            duration
          },
          footnote
        },

        _type == "resultsBlock" => {
          eyebrow,
          heading,
          stats[]{
            _key,
            value,
            suffix,
            label
          },
          sourceMode,
          "autoItems": *[_type == "caseStudy" && showOnHome == true]
            | order(sortOrder asc, _createdAt desc) ${PAGE_BUILDER_CASE_STUDY_FIELDS},
          "manualItems": manualCaseStudies[]-> ${PAGE_BUILDER_CASE_STUDY_FIELDS}
        },

        _type == "testimonialsBlock" => {
          eyebrow,
          heading,
          sourceMode,
          "autoItems": *[_type == "client"] | order(dateStarted desc) ${PAGE_BUILDER_CLIENT_FIELDS},
          "manualItems": manualTestimonials[]-> ${PAGE_BUILDER_CLIENT_FIELDS}
        },

        _type == "faqBlock" => {
          eyebrow,
          heading,
          intro,
          sourceMode,
          autoCategory,
          "autoItems": *[_type == "faq"] | order(order asc) ${PAGE_BUILDER_FAQ_FIELDS},
          "manualItems": manualFaqs[]-> ${PAGE_BUILDER_FAQ_FIELDS}
        },

        _type == "ctaBlock" => {
          ctaHeading,
          ctaSubtitle,
          ctaButton ${PAGE_BUILDER_LABELED_LINK_FIELDS},
          ctaFootnote,
          secondaryCta ${PAGE_BUILDER_LABELED_LINK_FIELDS}
        }
      }
    }
  `);

/**
 * siteSettings' Global CTA defaults, fetched alongside `PAGE_QUERY` rather
 * than folded into it — U9's `SITE_SETTINGS_QUERY` already owns this
 * projection (nav/footer/CTA in one document), and U15 wires the singleton
 * into `fetchQuery`'s chokepoint properly. This one is scoped to just the
 * four fields lib/sanity/lib/resolve-cta.ts's `SiteSettingsCtaDefaults`
 * needs, so a `ctaBlock` with no overrides has something to fall back to
 * ahead of U15 landing.
 */
export const PAGE_CTA_DEFAULTS_QUERY = defineQuery(`
    *[_id == "siteSettings"][0] {
      ctaHeading,
      ctaSubtitle,
      ctaButton ${PAGE_BUILDER_LABELED_LINK_FIELDS},
      ctaFootnote
    }
  `);

export const PAGE_SLUGS_QUERY = defineQuery(`
    *[_type == "page"].slug.current
  `);

export async function getPageSlugs() {
	const slugs = await fetchQuery<string[]>(
		PAGE_SLUGS_QUERY,
		{},
		// Static params must never include draft-only pages — sharper here
		// than the blog/template/case-study slug fetchers above, since this
		// catch-all sits at the site root and competes with every real route
		// rather than one namespaced under /blog or /templates (U14 of the
		// Sanity page builder plan).
		{ forcePublished: true }
	);
	return slugs;
}

export async function getPage(slug: string) {
	return fetchQuery(PAGE_QUERY, { slug });
}

export async function getPageCtaDefaults() {
	return fetchQuery(PAGE_CTA_DEFAULTS_QUERY, {});
}
