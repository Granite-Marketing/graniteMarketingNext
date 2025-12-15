import { client } from "./client";
import { fetchQuery } from "./lib/fetch";

// =============================================================================
// BLOG POSTS
// =============================================================================

export async function getBlogPosts() {
	return fetchQuery(`
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
  `);
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
  `
	);
}

export async function getBlogPostSlugs() {
	const slugs = await fetchQuery<string[]>(`
    *[_type == "blogPost" && !(_id in path("drafts.**"))].slug.current
  `);
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
		{ limit }
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
		{ categorySlug }
	);
}

// =============================================================================
// CASE STUDIES
// =============================================================================

export async function getCaseStudies() {
	return fetchQuery(`
    *[_type == "caseStudy" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      _id,
      title,
      slug,
      client,
      industry,
      excerpt,
      featuredImage {
        asset,
        alt
      },
      results[] {
        metric,
        value,
        description
      }
    }
  `);
}

export async function getCaseStudy(slug: string) {
	return fetchQuery(
		`
    *[_type == "caseStudy" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      client,
      industry,
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
        imageUrl
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
	const slugs = await fetchQuery<string[]>(`
    *[_type == "caseStudy" && !(_id in path("drafts.**"))].slug.current
  `);
	return slugs.map((slug) => ({ slug }));
}

// =============================================================================
// CATEGORIES
// =============================================================================

export async function getCategories() {
	return fetchQuery(`
    *[_type == "category" && !(_id in path("drafts.**"))] | order(name asc) {
      _id,
      name,
      slug,
      description
    }
  `);
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
	return fetchQuery(`
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
  `);
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

	return fetchQuery(query);
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
	return fetchQuery(`
    *[_type == "location" && !(_id in path("drafts.**"))] | order(name asc) {
      _id,
      name,
      slug,
      country,
      region
    }
  `);
}

// =============================================================================
// LOGO LIST
// =============================================================================

export async function getLogoList() {
	return fetchQuery(`
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
  `);
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
		{ limit }
	);
}

// =============================================================================
// AUTHORS
// =============================================================================

export async function getAuthors() {
	return fetchQuery(`
    *[_type == "author" && !(_id in path("drafts.**"))] | order(name asc) {
      _id,
      name,
      slug,
      image,
      bio,
      role,
      social
    }
  `);
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

export async function getHomeContent() {
	const [featuredLogos, testimonials, faqs] = await Promise.all([
		getFeaturedLogos(10),
		getClients(),
		getFAQs("general"),
	]);

	return {
		featuredLogos,
		testimonials,
		faqs,
	};
}
