import { client } from "./client";
import { fetchQuery } from "./lib/fetch";
import { adaptCaseStudyToCard } from "./lib/adapters";

// =============================================================================
// BLOG POSTS
// =============================================================================

export async function getBlogPosts() {
	return fetchQuery(
		`
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
  `,
		{}
	);
}

export async function getBlogPost(slug?: string) {
	if (!slug) {
		return null;
	}

	return fetchQuery(
		`
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
  `,
		{ slug }
	);
}

export async function getBlogPostSlugs() {
	const slugs = await fetchQuery<string[]>(
		`
    *[_type == "blogPost"].slug.current
  `,
		{},
		// Static params must never include draft-only posts.
		{ forcePublished: true }
	);
	return slugs.map((slug) => ({ slug }));
}

export async function getFeaturedBlogPosts(limit = 3) {
	return fetchQuery(
		`
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
  `,
		{ limit }
	);
}

export async function getBlogPostsByCategory(categorySlug: string) {
	return fetchQuery(
		`
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
  `,
		{ categorySlug }
	);
}

// =============================================================================
// WORKFLOW TEMPLATES
// =============================================================================

export async function getWorkflowTemplates() {
	return fetchQuery(
		`
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
  `,
		{}
	);
}

export async function getWorkflowTemplate(slug?: string) {
	if (!slug) {
		return null;
	}

	return fetchQuery(
		`
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
  `,
		{ slug }
	);
}

export async function getWorkflowTemplateSlugs() {
	const slugs = await fetchQuery<string[]>(
		`
    *[_type == "workflowTemplate"].slug.current
  `,
		{},
		// Static params must never include draft-only templates.
		{ forcePublished: true }
	);
	return slugs.map((slug) => ({ slug }));
}

// =============================================================================
// CASE STUDIES
// =============================================================================

export async function getCaseStudies() {
	return fetchQuery(
		`
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
  `,
		{}
	);
}

export async function getCaseStudy(slug: string) {
	return fetchQuery(
		`
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
  `,
		{ slug }
	);
}

export async function getCaseStudySlugs() {
	const slugs = await fetchQuery<string[]>(
		`
    *[_type == "caseStudy"] | order(sortOrder asc, _createdAt desc).slug.current
  `,
		{},
		// Static params must never include draft-only case studies.
		{ forcePublished: true }
	);
	return slugs.map((slug) => ({ slug }));
}

// =============================================================================
// CATEGORIES
// =============================================================================

export async function getCategories() {
	return fetchQuery(
		`
    *[_type == "category"] | order(name asc) {
      _id,
      name,
      slug,
      description
    }
  `,
		{}
	);
}

export async function getCategory(slug: string) {
	return fetchQuery(
		`
    *[_type == "category" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      description
    }
  `,
		{ slug }
	);
}

// =============================================================================
// CLIENTS (TESTIMONIALS)
// =============================================================================

export async function getClients() {
	return fetchQuery(
		`
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
  `,
		{}
	);
}

export async function getClient(slug: string) {
	return fetchQuery(
		`
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
  `,
		{ slug }
	);
}

// =============================================================================
// FAQs
// =============================================================================

export async function getFAQs(category?: string) {
	const categoryFilter = category ? " && category == $category" : "";

	const query = `
    *[_type == "faq"${categoryFilter}] | order(order asc) {
      _id,
      question,
      slug,
      answer,
      order,
      category
    }
  `;

	return fetchQuery(query, category ? { category } : {});
}

export async function getFAQ(slug: string) {
	return fetchQuery(
		`
    *[_type == "faq" && slug.current == $slug][0] {
      _id,
      question,
      slug,
      answer,
      category
    }
  `,
		{ slug }
	);
}

// =============================================================================
// LOCATIONS
// =============================================================================

export async function getLocations() {
	return fetchQuery(
		`
    *[_type == "location"] | order(name asc) {
      _id,
      name,
      slug,
      country,
      region
    }
  `,
		{}
	);
}

// =============================================================================
// LOGO LIST
// =============================================================================

export async function getLogoList() {
	return fetchQuery(
		`
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
  `,
		{}
	);
}

export async function getFeaturedLogos(limit = 10) {
	return fetchQuery(
		`
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
  `,
		{ limit }
	);
}

// =============================================================================
// TOOLS
// =============================================================================

export async function getTools() {
	return fetchQuery(
		`
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
  `,
		{}
	);
}

// =============================================================================
// AUTHORS
// =============================================================================

export async function getAuthors() {
	return fetchQuery(
		`
    *[_type == "author"] | order(name asc) {
      _id,
      name,
      slug,
      image,
      bio,
      role,
      social
    }
  `,
		{}
	);
}

export async function getAuthor(slug: string) {
	return fetchQuery(
		`
    *[_type == "author" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      image,
      bio,
      role,
      social
    }
  `,
		{ slug }
	);
}

// =============================================================================
// COMPOSED HELPERS FOR MARKETING PAGES
// =============================================================================

export async function getHomepageCaseStudies(limit = 24) {
	const docs: any[] = await fetchQuery(
		`
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
  `,
		{ limit }
	);

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
