import { resolveLink } from "./resolve-link";
import type { LinkValue, ResolveLinkContext, ResolvedLink } from "./resolve-link";

// Pure resolvers turning the siteSettings singleton's raw query result (U9
// of the Sanity page builder plan) into what nav/logo/footer rendering
// needs. Nav and footer components themselves land in U15 — this file gives
// them a single, already-tested place to resolve through, rather than each
// reimplementing the same "map through resolveLink, don't crash on empty"
// logic against a still-unbuilt component.

type LabeledLinkValue =
	| {
			label?: string | null;
			link?: LinkValue;
	  }
	| null
	| undefined;

export type ResolvedNavLink = ResolvedLink & { label: string };

/**
 * Maps `siteSettings.navLinks` (or a footer column's `links`) through the
 * U7 resolver, in the array's own order. An item that fails to resolve (no
 * label, or a dangling/unresolvable link) is dropped rather than rendered as
 * a dead anchor — the same fail-closed posture `resolveLink` itself takes on
 * a dangling reference.
 */
export function resolveNavLinks(
	links: LabeledLinkValue[] | null | undefined,
	context: ResolveLinkContext = {}
): ResolvedNavLink[] {
	if (!links?.length) return [];

	const resolved: ResolvedNavLink[] = [];
	for (const item of links) {
		if (!item?.label) continue;
		const link = resolveLink(item.link, context);
		if (!link) continue;
		resolved.push({ label: item.label, ...link });
	}
	return resolved;
}

export type SiteSettingsLogoLink = LinkValue;

const HOME_LINK: ResolvedLink = { href: "/" };

/**
 * `logoLink` unset (or unresolvable) falls back to the homepage rather than
 * rendering a dead anchor — the logo is always clickable.
 */
export function resolveLogoLink(
	logoLink: SiteSettingsLogoLink,
	context: ResolveLinkContext = {}
): ResolvedLink {
	return resolveLink(logoLink, context) ?? HOME_LINK;
}

export type SiteSettingsFooterColumn = {
	heading?: string | null;
	links?: LabeledLinkValue[] | null;
} | null;

export type ResolvedFooterColumn = {
	heading: string;
	links: ResolvedNavLink[];
};

/**
 * An empty (or unset) `footerColumns` resolves to an empty array rather than
 * throwing, so the footer renders its brand column with no columns beside
 * it instead of crashing the layout. A column with a heading but zero
 * resolvable links still renders — an empty `links` array, not a dropped
 * column — since the heading itself may still be meaningful copy.
 */
export function resolveFooterColumns(
	columns: SiteSettingsFooterColumn[] | null | undefined,
	context: ResolveLinkContext = {}
): ResolvedFooterColumn[] {
	if (!columns?.length) return [];

	const resolved: ResolvedFooterColumn[] = [];
	for (const column of columns) {
		if (!column?.heading) continue;
		resolved.push({
			heading: column.heading,
			links: resolveNavLinks(column.links, context),
		});
	}
	return resolved;
}
