import { stegaClean } from "@sanity/client/stega";
import { CAL_LINK } from "@/components/data";
import {
	LINKABLE_ROUTE_BY_TYPE,
	isLinkableFixedRouteType,
	type LinkableFixedRouteType,
} from "../routes";

// The single resolver turning a `link` object (lib/sanity/studio-schemas/objects/link.ts)
// into either a navigation target or a Cal.com booking instruction, everywhere
// the site needs one (nav, footer, CTAs, in-body links).
//
// KTD4 — `linkType` is author-entered content, so in Draft Mode it carries
// invisible stega characters and `linkType === "external"` silently returns
// false (docs/solutions/best-practices/sanity-visual-editing-draft-mode-gotchas.md
// §1). `stegaClean` is called ONCE here, on the whole link value, before any
// switching happens — never at each call site. `@sanity/client/stega` (not
// `next-sanity`) is the narrower entry point, consistent with the only other
// stegaClean import in this codebase that runs in a client component
// (lib/sanity/components/CodeBlock.tsx).
//
// `ResolvedLink` is a discriminated union on `kind`, not a single `{ href }`
// shape with a Cal variant bolted on. A `calBooking` link is NOT navigation —
// it opens the Cal.com modal (components/cal-button.tsx) and must never be
// handed to an `<a href>`/`<Link href>` as a plain string. Smuggling the Cal
// handle through the `href` field (e.g. `href: "cal:sanindo/30min"`) would
// let a careless call site render it as a dead/wrong anchor with nothing to
// catch the mistake at compile time. Branching on `kind` instead means a
// caller that only destructures `.href` gets a TypeScript error on the
// `calBooking` branch (no `href` property exists there) rather than a silent
// runtime bug — see resolve-link.test.ts's "cannot be rendered as a plain
// href by mistake" case for the regression guard.

// U21/U22 prep (2026-07-19) — the three fixed-route singletons an editor can
// now target from `internalRef` (see link.ts's `to` array). Folded into
// `InternalDocType` via `LinkableFixedRouteType` rather than hand-typed
// again: that type is already the single place excluding blogPostTemplate
// and templateDetail (routes.ts), and repeating its members here would be
// exactly the kind of second copy that file's header comment warns against.
type InternalDocType =
	| "page"
	| "blogPost"
	| "workflowTemplate"
	| "legalPage"
	| LinkableFixedRouteType;

/**
 * The shape a GROQ query produces once an internal reference has been
 * dereferenced with `->`. A dangling reference dereferences to `null`.
 */
type DereferencedDoc =
	| {
			_type: InternalDocType;
			_id?: string;
			slug?: { current?: string | null } | null;
	  }
	| null
	| undefined;

export type LinkValue =
	| {
			linkType?: string | null;
			internalRef?: DereferencedDoc;
			anchorPage?: DereferencedDoc;
			anchorId?: string | null;
			href?: string | null;
			openInNewTab?: boolean | null;
			calLink?: string | null;
	  }
	| null
	| undefined;

/**
 * `kind: "navigate"` is a real destination — hand its `href` to `<a>`/
 * `<Link>`. `kind: "calBooking"` is not: it's an instruction to open the
 * Cal.com modal with `calLink` as the booking handle
 * (`data-cal-link` in components/cal-button.tsx), and has no `href` at all.
 */
export type ResolvedLink =
	| {
			kind: "navigate";
			href: string;
			target?: "_blank";
			rel?: "noopener noreferrer";
	  }
	| {
			kind: "calBooking";
			calLink: string;
	  };

export type ResolveLinkContext = {
	/**
	 * The slug of the page currently being rendered. An `anchor` link whose
	 * target page matches this slug (or has no page reference at all —
	 * "anchor on the current page") collapses to a bare `#anchorId` instead
	 * of a full `/slug#anchorId` navigation.
	 */
	currentSlug?: string;
};

/**
 * `page` and `legalPage` both render at a flat, root-level path (`/{slug}`)
 * today — `legalPage`'s route segment is the fixed Next.js folder that
 * mirrors its slug 1:1 (app/privacy, app/terms, app/cookies, ... — see
 * components/data.ts's policy links), while `page` reaches the same shape
 * through the U14 `/[slug]` catch-all. Kept as separate `case`s rather than
 * a shared fallthrough so a document type that's silently missing from this
 * switch fails closed (returns null) instead of accidentally inheriting
 * another type's path scheme.
 *
 * blogListing/templateListing/contactPage are handled BEFORE the slug
 * guard below, not inside the switch — they are fixed-route singletons
 * with no `slug` field at all (see routes.ts's `LinkableFixedRouteType`),
 * so the `!slug` check that every other branch relies on would reject them
 * outright, and their path never came from a slug in the first place. It
 * comes from `LINKABLE_ROUTE_BY_TYPE`, the same map U21/U22's Route display
 * field reads its label from — one string per route, not a second copy
 * hand-typed into this switch. Checking `isLinkableFixedRouteType` first,
 * rather than adding cases to the switch below, is what keeps
 * blogPostTemplate and templateDetail structurally unresolvable: neither is
 * a member of `LinkableFixedRouteType`, so there is no `LINKABLE_ROUTE_BY_TYPE`
 * entry for either to fall into even by accident.
 */
function pathForInternalDoc(doc: DereferencedDoc): string | null {
	if (!doc) return null;

	if (isLinkableFixedRouteType(doc._type)) {
		return LINKABLE_ROUTE_BY_TYPE[doc._type];
	}

	const slug = doc.slug?.current;
	if (!slug) return null;

	switch (doc._type) {
		case "blogPost":
			return `/blog/${slug}`;
		case "workflowTemplate":
			return `/templates/${slug}`;
		case "page":
			return `/${slug}`;
		case "legalPage":
			return `/${slug}`;
		default:
			return null;
	}
}

export function resolveLink(
	link: LinkValue,
	context: ResolveLinkContext = {}
): ResolvedLink | null {
	// stegaClean operates on the whole serialized value (JSON.stringify →
	// strip the stega regex → JSON.parse), so a single call here scrubs
	// linkType, the dereferenced slugs, anchorId and href in one pass —
	// exactly the "clean once, at the utility" rule KTD4 exists to enforce.
	const clean = stegaClean(link) as LinkValue;
	if (!clean) return null;

	switch (clean.linkType) {
		case "internal": {
			const href = pathForInternalDoc(clean.internalRef ?? null);
			return href ? { kind: "navigate", href } : null;
		}

		case "anchor": {
			if (!clean.anchorId) return null;

			const targetSlug = clean.anchorPage?.slug?.current ?? null;
			const isCurrentPage =
				!targetSlug || targetSlug === context.currentSlug;

			return isCurrentPage
				? { kind: "navigate", href: `#${clean.anchorId}` }
				: { kind: "navigate", href: `/${targetSlug}#${clean.anchorId}` };
		}

		case "external": {
			if (!clean.href) return null;

			return clean.openInNewTab
				? {
						kind: "navigate",
						href: clean.href,
						target: "_blank",
						rel: "noopener noreferrer",
					}
				: { kind: "navigate", href: clean.href };
		}

		case "calBooking": {
			// The field is genuinely optional (see link.ts) — most editors leave
			// it unset and inherit the site's standard booking handle. `|| `, not
			// `??`, so an author-cleared empty string also falls back rather than
			// resolving to a Cal.com modal with an empty handle.
			return { kind: "calBooking", calLink: clean.calLink || CAL_LINK };
		}

		default:
			// Unknown/missing linkType — fail closed rather than throwing, the
			// same posture as a dangling reference.
			return null;
	}
}
