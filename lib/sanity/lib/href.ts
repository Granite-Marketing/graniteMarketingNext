// Shared scheme allowlist for a `link` object's `href` field
// (lib/sanity/studio-schemas/objects/link.ts), used from two places that
// must never drift apart:
//
// 1. link.ts's `Rule.custom` validator — Studio-side, browser-only. It
//    blocks the Publish button, but nothing else: it does not run for a
//    draft (which Draft Mode preview renders), a direct Content Lake write,
//    or a seed/migration script write (see the three scripts under
//    scripts/). app/[slug]/page.tsx's reserved-slug guard comment makes
//    this exact argument for why a Studio-only check isn't enough.
// 2. resolve-link.ts's `external` branch — the runtime guard. This is what
//    actually stops an editor-authored or API-written `javascript:`/`data:`
//    href from reaching `<a href>` as stored XSS. It matters more than
//    usual here because sanity.config.ts's `basePath: "/studio"` makes the
//    Studio same-origin with the rendered pages, so that XSS would reach an
//    admin's authenticated Studio session.
//
// Lives in lib/sanity/lib/ (not the studio-schemas file) specifically so
// the runtime render path never imports a Studio schema module.
const ABSOLUTE_HREF_SCHEMES = ["http:", "https:", "mailto:", "tel:"];

/**
 * Accepts an absolute URL on an allowed scheme, or a site-relative path.
 *
 * Exported and tested directly rather than inlined, following the same
 * convention as `validatePageSlug` and `validateFeaturedGridTiling` — the
 * accept/reject boundary is the behaviour worth pinning.
 */
export function isValidHref(value: string): boolean {
	const trimmed = value.trim();
	if (!trimmed) return false;

	// Site-relative: "/contact", "/blog?tag=x". A protocol-relative "//host"
	// is deliberately rejected — it is almost always a mistake here, and it
	// silently inherits the page's scheme.
	if (trimmed.startsWith("/")) return !trimmed.startsWith("//");

	try {
		return ABSOLUTE_HREF_SCHEMES.includes(new URL(trimmed).protocol);
	} catch {
		return false;
	}
}
