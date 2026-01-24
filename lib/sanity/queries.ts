import { client } from "./client";
import { fetchQuery } from "./lib/fetch";
import { adaptCaseStudyToCard } from "./lib/adapters";

// =============================================================================
// BLOG POSTS
// =============================================================================

export async function getBlogPosts() {
	return fetchQuery(
		`
    *[_type == "blogPost" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
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
		{},
		{ revalidateSeconds: 3600 }
	);
}

export async function getBlogPost(slug?: string) {
	if (!slug) {
		return null;
	}

	const safeSlug = slug.replace(/"/g, '\\"');

	return fetchQuery(
		`
    *[_type == "blogPost" && slug.current == "${safeSlug}"][0] {
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
      }
    }
  `,
		{},
		{ revalidateSeconds: 3600 }
	);
}

export async function getBlogPostSlugs() {
	const slugs = await fetchQuery<string[]>(
		`
    *[_type == "blogPost" && !(_id in path("drafts.**"))].slug.current
  `,
		{},
		{ revalidateSeconds: 3600 }
	);
	return slugs.map((slug) => ({ slug }));
}

export async function getFeaturedBlogPosts(limit = 3) {
	return fetchQuery(
		`
    *[_type == "blogPost" && featured == true && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...$limit] {
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
		{ limit },
		{ revalidateSeconds: 3600 }
	);
}

export async function getBlogPostsByCategory(categorySlug: string) {
	return fetchQuery(
		`
    *[_type == "blogPost" && $categorySlug in categories[]->slug.current && !(_id in path("drafts.**"))] | order(publishedAt desc) {
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
		{ categorySlug },
		{ revalidateSeconds: 3600 }
	);
}

// =============================================================================
// CASE STUDIES
// =============================================================================

export async function getCaseStudies() {
	return fetchQuery(
		`
    *[_type == "caseStudy" && !(_id in path("drafts.**"))] | order(sortOrder asc, _createdAt desc) {
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
		{},
		{ revalidateSeconds: 1800 }
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
		{ slug },
		{ revalidateSeconds: 1800 }
	);
}

export async function getCaseStudySlugs() {
	const slugs = await fetchQuery<string[]>(
		`
    *[_type == "caseStudy" && !(_id in path("drafts.**"))] | order(sortOrder asc, _createdAt desc).slug.current
  `,
		{},
		{ revalidateSeconds: 1800 }
	);
	return slugs.map((slug) => ({ slug }));
}

// =============================================================================
// CATEGORIES
// =============================================================================

export async function getCategories() {
	return fetchQuery(
		`
    *[_type == "category" && !(_id in path("drafts.**"))] | order(name asc) {
      _id,
      name,
      slug,
      description
    }
  `,
		{},
		{ revalidateSeconds: 7200 }
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
		{ slug },
		{ revalidateSeconds: 7200 }
	);
}

// =============================================================================
// CLIENTS (TESTIMONIALS)
// =============================================================================

export async function getClients() {
	return fetchQuery(
		`
    *[_type == "client" && !(_id in path("drafts.**"))] | order(dateStarted desc) {
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
		{},
		{ revalidateSeconds: 1800 }
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
		{ slug },
		{ revalidateSeconds: 1800 }
	);
}

// =============================================================================
// FAQs
// =============================================================================

export async function getFAQs(category?: string) {
	const categoryFilter = category ? ` && category == "${category}"` : "";

	const query = `
    *[_type == "faq" && !(_id in path("drafts.**"))${categoryFilter}] | order(order asc) {
      _id,
      question,
      slug,
      answer,
      order,
      category
    }
  `;

	return fetchQuery(query, {}, { revalidateSeconds: 7200 });
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
		{ slug },
		{ revalidateSeconds: 7200 }
	);
}

// =============================================================================
// LOCATIONS
// =============================================================================

export async function getLocations() {
	return fetchQuery(
		`
    *[_type == "location" && !(_id in path("drafts.**"))] | order(name asc) {
      _id,
      name,
      slug,
      country,
      region
    }
  `,
		{},
		{ revalidateSeconds: 7200 }
	);
}

// =============================================================================
// LOGO LIST
// =============================================================================

export async function getLogoList() {
	return fetchQuery(
		`
    *[_type == "logoList" && !(_id in path("drafts.**"))] | order(sortOrder asc) {
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
		{},
		{ revalidateSeconds: 7200 }
	);
}

export async function getFeaturedLogos(limit = 10) {
	return fetchQuery(
		`
    *[_type == "logoList" && featured == true && !(_id in path("drafts.**"))] | order(sortOrder asc) [0...$limit] {
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
		{ limit },
		{ revalidateSeconds: 1800 }
	);
}

// =============================================================================
// TOOLS
// =============================================================================

export async function getTools() {
	return fetchQuery(
		`
    *[_type == "tool" && !(_id in path("drafts.**"))] | order(name asc) {
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
		{},
		{ revalidateSeconds: 7200 }
	);
}

// =============================================================================
// AUTHORS
// =============================================================================

export async function getAuthors() {
	return fetchQuery(
		`
    *[_type == "author" && !(_id in path("drafts.**"))] | order(name asc) {
      _id,
      name,
      slug,
      image,
      bio,
      role,
      social
    }
  `,
		{},
		{ revalidateSeconds: 7200 }
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
		{ slug },
		{ revalidateSeconds: 7200 }
	);
}

// =============================================================================
// COMPOSED HELPERS FOR MARKETING PAGES
// =============================================================================

export async function getHomepageCaseStudies(limit = 3) {
	const docs: any[] = await fetchQuery(
		`
    *[_type == "caseStudy" && showOnHome == true && !(_id in path("drafts.**"))]
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
		{ limit },
		{ revalidateSeconds: 1800 }
	);

	return docs.map((doc) => adaptCaseStudyToCard(doc));
}

export async function getHomeContent() {
	const [featuredLogos, testimonials, faqs, caseStudies] = await Promise.all([
		getFeaturedLogos(10),
		getClients(),
		getFAQs("general"),
		getHomepageCaseStudies(3),
	]);

	return {
		featuredLogos,
		testimonials,
		faqs,
		caseStudies,
	};
}
