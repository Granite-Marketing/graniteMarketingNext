import type { SingletonType } from "./singletons";

// PART 1 of the fixed-route-visibility unit (2026-07-19) — the ONE place in
// the whole repo that maps a fixed-route page type to the URL it serves.
// studio-components/route-field.tsx's `routeField()` is the only consumer;
// every one of the five page-type singleton schemas calls it, so there is
// exactly one string per route rather than five hand-typed copies that
// could quietly drift apart.
//
// This is deliberately NOT sourced from the Next.js file-system router at
// build/run time — there is no bridge between a Studio schema module
// (bundled and executed inside Sanity Studio's own React app) and
// app/**/page.tsx (bundled by Next.js as a separate application). Hand
// maintaining this map is an accepted, explicit cost: if a route ever
// moves, whoever moves the app/ file must also update the string here. What
// must never happen is the OPPOSITE direction of drift — a copy of the
// route living inside a Sanity DOCUMENT (data an editor can open and
// change) that silently stops matching the real route the moment someone
// restructures app/. That is the drift PART 1's hard constraints rule out:
// the string below lives in code, reviewed and versioned the same way
// app/**/page.tsx is, not in content.
//
// siteSettings is the sixth registered singleton (see ./singletons.ts) but
// configures every page rather than serving one route of its own, so it is
// deliberately excluded from this map's key type rather than given a
// placeholder value nobody would trust.
export type FixedRouteType = Exclude<SingletonType, "siteSettings">;

// PART 2 (2026-07-19, U21/U22 prep) — ROUTE_BY_TYPE above was a display-only
// map from the start (studio-components/route-field.tsx's read-only "Route"
// field is its one consumer), but it held two different kinds of string:
// blogListing/templateListing/contactPage are real, resolvable routes,
// while blogPostTemplate/templateDetail are human-readable descriptions of
// a URL *pattern* applied to many records ("/blog/… (applies to every blog
// post)") — never a URL anyone could navigate to. That distinction did not
// matter while the only consumer was a label. It became a live bug the
// moment something needed to resolve an actual href from this map (the
// `link` union, lib/sanity/lib/resolve-link.ts): a link to blogPostTemplate
// would produce the literal, broken href "/blog/… (applies to every blog
// post)".
//
// ROUTE_BY_TYPE keeps its name and its exact values — Studio's Route field
// must render identically to before, unchanged, so route-field.tsx needs no
// changes and the existing display-string test keeps passing. What's new
// is LINKABLE_ROUTE_BY_TYPE below: a second, narrower map that only exists
// for the three types that serve a real route, keyed by a type
// (`LinkableFixedRouteType`) that *excludes* blogPostTemplate and
// templateDetail at the type level. That is deliberately stronger than a
// function returning `string | undefined` for the excluded two: with a
// function, "this type has no route" is a runtime fact a caller can forget
// to check; with an excluded key, `LINKABLE_ROUTE_BY_TYPE.blogPostTemplate`
// does not compile at all — there is no href to accidentally produce.
export const ROUTE_BY_TYPE: Record<FixedRouteType, string> = {
	blogListing: "/blog",
	templateListing: "/templates",
	contactPage: "/contact",
	blogPostTemplate: "/blog/… (applies to every blog post)",
	templateDetail: "/templates/… (applies to every template)",
};

/**
 * The fixed-route types an editor can pick as a `link` union target — see
 * `lib/sanity/studio-schemas/objects/link.ts`'s `internalRef.to`. Excludes
 * blogPostTemplate and templateDetail: both describe chrome applied to many
 * per-record pages, not a page of their own, so there is no single href a
 * link to either of them could mean.
 */
export type LinkableFixedRouteType = Exclude<
	FixedRouteType,
	"blogPostTemplate" | "templateDetail"
>;

const LINKABLE_FIXED_ROUTE_TYPES: readonly LinkableFixedRouteType[] = [
	"blogListing",
	"templateListing",
	"contactPage",
];

// Sourced FROM ROUTE_BY_TYPE rather than hand-typed a second time — the
// same "exactly one string per route" rule the file header already states,
// now enforced across two maps instead of one. If ROUTE_BY_TYPE's value for
// one of these three ever changes, this map changes with it automatically;
// it cannot quietly drift to a stale copy.
export const LINKABLE_ROUTE_BY_TYPE: Record<LinkableFixedRouteType, string> =
	Object.fromEntries(
		LINKABLE_FIXED_ROUTE_TYPES.map((type) => [type, ROUTE_BY_TYPE[type]])
	) as Record<LinkableFixedRouteType, string>;

const LINKABLE_FIXED_ROUTE_TYPE_SET = new Set<string>(
	LINKABLE_FIXED_ROUTE_TYPES
);

/**
 * Runtime companion to the type-level exclusion above. Needed because a
 * dereferenced `internalRef->{ _type, ... }` value's `_type` is a plain
 * string at runtime (GROQ has no way to prove it statically) — this is what
 * lets `resolve-link.ts` index `LINKABLE_ROUTE_BY_TYPE` safely instead of
 * casting.
 */
export function isLinkableFixedRouteType(
	type: string | undefined
): type is LinkableFixedRouteType {
	return type !== undefined && LINKABLE_FIXED_ROUTE_TYPE_SET.has(type);
}
