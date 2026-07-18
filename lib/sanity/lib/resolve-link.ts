import { stegaClean } from "@sanity/client/stega";

// The single resolver turning a `link` object (lib/sanity/studio-schemas/objects/link.ts)
// into an href, everywhere the site needs one (nav, footer, CTAs, in-body links).
//
// KTD4 — `linkType` is author-entered content, so in Draft Mode it carries
// invisible stega characters and `linkType === "external"` silently returns
// false (docs/solutions/best-practices/sanity-visual-editing-draft-mode-gotchas.md
// §1). `stegaClean` is called ONCE here, on the whole link value, before any
// switching happens — never at each call site. `@sanity/client/stega` (not
// `next-sanity`) is the narrower entry point, consistent with the only other
// stegaClean import in this codebase that runs in a client component
// (lib/sanity/components/CodeBlock.tsx).

type InternalDocType = "page" | "blogPost" | "workflowTemplate" | "legalPage";

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
	  }
	| null
	| undefined;

export type ResolvedLink = {
	href: string;
	target?: "_blank";
	rel?: "noopener noreferrer";
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
 */
function pathForInternalDoc(doc: DereferencedDoc): string | null {
	const slug = doc?.slug?.current;
	if (!doc || !slug) return null;

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
			return href ? { href } : null;
		}

		case "anchor": {
			if (!clean.anchorId) return null;

			const targetSlug = clean.anchorPage?.slug?.current ?? null;
			const isCurrentPage =
				!targetSlug || targetSlug === context.currentSlug;

			return isCurrentPage
				? { href: `#${clean.anchorId}` }
				: { href: `/${targetSlug}#${clean.anchorId}` };
		}

		case "external": {
			if (!clean.href) return null;

			return clean.openInNewTab
				? { href: clean.href, target: "_blank", rel: "noopener noreferrer" }
				: { href: clean.href };
		}

		default:
			// Unknown/missing linkType — fail closed rather than throwing, the
			// same posture as a dangling reference.
			return null;
	}
}
