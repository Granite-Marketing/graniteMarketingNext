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
