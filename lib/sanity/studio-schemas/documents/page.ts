import { defineType, defineField } from "sanity";
import type { SlugValue } from "sanity";
import { DocumentIcon } from "@sanity/icons";

// The container the whole page builder hangs off (U8 of the Sanity page
// builder plan). `sections` is the named `pageBuilder` array (empty `of: []`
// until U12 adds block types); `seo` is the named type promoted in U7.

// Routes these slugs already own outside the page builder — a top-level
// `/blog`, hitting `/api`, etc. A page published at any of these would
// collide with an existing route.
export const RESERVED_PAGE_SLUGS = [
	"blog",
	"templates",
	"contact",
	"privacy",
	"terms",
	"cookies",
	"refund-policy",
	"delivery-policy",
	"studio",
	"api",
	"_next",
] as const;

const RESERVED_PAGE_SLUG_SET = new Set<string>(RESERVED_PAGE_SLUGS);

// Sanity's own default slugify (speakingurl, via `type.options.slugify ??
// defaultSlugify` in sanity/lib/index.js) isn't exported for reuse, so this
// is a small equivalent: lowercase, collapse anything that isn't a-z0-9 into
// a single hyphen, trim leading/trailing hyphens, cap at the same maxLength
// used below.
const SLUG_MAX_LENGTH = 96;

function slugifyTitle(source: string): string {
	return source
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, SLUG_MAX_LENGTH);
}

// Matches Sanity's own generated slug shape at generation time: prefix a
// reserved value so authors typing a title like "Blog" rarely hit the
// validation error at all. This is a courtesy, not the guard — the
// validator below is what actually blocks publish, and an author can still
// hand-edit the slug field back to a reserved value.
function slugifyWithReservedGuard(source: string): string {
	const base = slugifyTitle(source);
	return RESERVED_PAGE_SLUG_SET.has(base)
		? `${base}-page`.slice(0, SLUG_MAX_LENGTH)
		: base;
}

const SLUG_FORMAT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function validatePageSlug(value: SlugValue | undefined): true | string {
	// Caveat (a): custom validators run even when the field is empty —
	// Sanity does NOT skip `Rule.custom()` on `undefined` the way it skips
	// most built-in rules; only `Rule.optional()` opts a field out of that.
	// Without this guard, `value.current` below would throw on an empty
	// draft and surface as a confusing crash instead of a clean "required"
	// message.
	const current = value?.current;
	if (!current) return "Slug is required";

	// Reserved-word check runs before the format check: `_next` is a
	// reserved slug but would also fail the format regex below (leading
	// underscore), and reserved slugs must always name the conflict
	// explicitly rather than surface as a generic format error.
	if (RESERVED_PAGE_SLUG_SET.has(current)) {
		return `"${current}" is reserved for the /${current} route and cannot be used as a page slug`;
	}

	if (!SLUG_FORMAT.test(current)) {
		return "Slug must be lowercase letters, numbers and single hyphens only: no spaces, no uppercase, no leading or trailing hyphen";
	}

	return true;
}

export const page = defineType({
	name: "page",
	title: "Page",
	type: "document",
	icon: DocumentIcon,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: SLUG_MAX_LENGTH,
				slugify: slugifyWithReservedGuard,
			},
			// Caveat (b): this validation is Studio-side only — it runs in the
			// browser when an editor fills in the field, not on the Content
			// Lake's API mutation endpoints. A document published via the API
			// (a migration script, another integration) bypasses it entirely.
			// It is defence in depth, not a route-collision guarantee; the
			// Next.js route resolver (U14) is the actual defence against a page
			// slug colliding with a reserved route at request time.
			validation: (Rule) =>
				Rule.custom((value: SlugValue | undefined) => validatePageSlug(value)),
		}),
		defineField({
			name: "seo",
			title: "SEO",
			type: "seo",
		}),
		defineField({
			name: "sections",
			title: "Sections",
			type: "pageBuilder",
		}),
	],
	preview: {
		select: {
			title: "title",
			slug: "slug.current",
		},
		prepare({ title }) {
			// Was `/${slug}` — the Presentation panel needs to say WHAT KIND
			// of document a row is, not repeat its route (already visible in
			// the preview iframe itself). See
			// documents/__tests__/previews.test.ts.
			return {
				title,
				subtitle: "Page",
			};
		},
	},
});
