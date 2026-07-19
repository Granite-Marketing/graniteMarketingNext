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

export const ROUTE_BY_TYPE: Record<FixedRouteType, string> = {
	blogListing: "/blog",
	templateListing: "/templates",
	contactPage: "/contact",
	blogPostTemplate: "/blog/… (applies to every blog post)",
	templateDetail: "/templates/… (applies to every template)",
};
