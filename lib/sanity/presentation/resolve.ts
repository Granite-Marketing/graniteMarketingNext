import {
	defineDocuments,
	defineLocations,
	type PresentationPluginOptions,
} from "sanity/presentation";

/**
 * Presentation tool resolution.
 *
 * Two directions, both needed:
 *   - `locations`     document -> "where does this appear on the site?"
 *   - `mainDocuments` URL      -> "which document drives this page?"
 *
 * Types with no dedicated route (authors, categories, clients, FAQs, logos,
 * locations, tools) deliberately use a `message` instead of a fabricated href.
 * Inventing a URL for them would give editors a link straight to a 404.
 */
export const resolve: PresentationPluginOptions["resolve"] = {
	mainDocuments: defineDocuments([
		{
			route: "/blog/:slug",
			filter: `_type == "blogPost" && slug.current == $slug`,
		},
		{
			route: "/templates/:slug",
			filter: `_type == "workflowTemplate" && slug.current == $slug`,
		},
	]),

	locations: {
		blogPost: defineLocations({
			select: { title: "title", slug: "slug.current" },
			resolve: (doc) => ({
				locations: [
					{
						title: doc?.title || "Untitled post",
						href: `/blog/${doc?.slug}`,
					},
					{ title: "Blog index", href: "/blog" },
				],
			}),
		}),

		workflowTemplate: defineLocations({
			select: { title: "title", slug: "slug.current" },
			resolve: (doc) => ({
				locations: [
					{
						title: doc?.title || "Untitled template",
						href: `/templates/${doc?.slug}`,
					},
					{ title: "Templates index", href: "/templates" },
				],
			}),
		}),

		// Case studies render as cards on the homepage. There is no
		// /case-studies/[slug] route in this app.
		caseStudy: defineLocations({
			select: { title: "title" },
			resolve: (doc) => ({
				locations: [
					{
						title: `${doc?.title || "Case study"} (homepage card)`,
						href: "/",
					},
				],
			}),
		}),

		author: defineLocations({
			message: "Authors appear as bylines on blog posts and templates.",
			tone: "caution",
		}),

		category: defineLocations({
			message: "Categories appear as filters and tags on blog and template listings.",
			tone: "caution",
		}),

		client: defineLocations({
			message: "Clients supply testimonials and logos shown on the homepage.",
			tone: "caution",
		}),

		faq: defineLocations({
			message: "FAQs appear in the FAQ section on the homepage.",
			tone: "caution",
		}),

		logoList: defineLocations({
			message: "Logos appear in the client logo strip on the homepage.",
			tone: "caution",
		}),

		location: defineLocations({
			message: "Locations are referenced by client records, not rendered directly.",
			tone: "caution",
		}),

		tool: defineLocations({
			message: "Tools appear in the tools/integrations strip on the homepage.",
			tone: "caution",
		}),

		workflowCategory: defineLocations({
			message: "Workflow categories group templates on the templates listing.",
			tone: "caution",
		}),
	},
};
