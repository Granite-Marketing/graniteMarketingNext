import { resolveBrandMarkLogo } from "./brand-mark";
import { NavClient } from "./nav-client";
import { getSiteSettings } from "@/lib/sanity/queries";
import { resolveLink } from "@/lib/sanity/lib/resolve-link";
import type { LinkValue, ResolvedLink } from "@/lib/sanity/lib/resolve-link";
import { navLinks as hardcodedNavLinks } from "./data";

// U22 of the Sanity page builder plan — nav (and, via the exports below,
// footer) render their links from `siteSettings` when it has them, and from
// today's hardcoded components/data.ts when it does not.

/**
 * A resolved `{ label, link }` pair, ready to render — `ResolvedLink & {
 * label }`, the same shape lib/sanity/lib/resolve-cta.ts's
 * `ResolvedCtaButton` uses for the Global CTA button, for the same reason:
 * `kind: "navigate"` carries an `href` a `<Link>` can use directly, and
 * `kind: "calBooking"` carries no `href` at all, so a caller that only
 * destructures `.href` gets a compile error on the calBooking branch rather
 * than a silent dead anchor. Not imported from resolve-cta.ts — that type is
 * scoped to the CTA block, not nav/footer links, and this unit doesn't own
 * that file. Exported here (rather than duplicated) so footer.tsx — which
 * resolves the exact same `{ label, link }[]` shape for `footerColumns` —
 * reuses one definition instead of a second copy of the same four lines.
 */
export type ResolvedLabeledLink = ResolvedLink & { label: string };

type LabeledLinkValue =
	| {
			label?: string | null;
			link?: LinkValue;
	  }
	| null
	| undefined;

/**
 * Resolves an array of `{ label, link }` pairs — siteSettings' `navLinks`,
 * `headerCta` (wrapped in a one-item array by callers), and footer.tsx's
 * `footerColumns[].links` are all this exact shape (see
 * siteSettings.ts's `labeledLinkFields`). An item with no label, or whose
 * link fails to resolve (a dangling reference — `resolveLink` returns
 * `null`), is dropped rather than rendered as a dead anchor.
 *
 * No `currentSlug` is passed to `resolveLink`'s context. Nav and Footer
 * render on every route (~26 of them) and neither receives the current
 * page's slug today — threading one through would mean either prop-drilling
 * it from every `<Nav />`/`<Footer />` call site across app/** (out of this
 * unit's scope, and app/** is explicitly not to be touched) or reading it
 * from a client-side hook, which would only work in NavClient and still
 * leave Footer (a plain server component with no route context) unable to
 * supply one. Omitting it makes an `anchor`-typed link resolve to a full
 * `/{slug}#id` path always, even when that slug matches the current page —
 * exactly what today's hardcoded nav already does (components/data.ts's
 * `/#services` etc. are always absolute), so this is a deliberate match to
 * existing behaviour, not an oversight.
 */
export function resolveLabeledLinks(
	items: LabeledLinkValue[] | null | undefined
): ResolvedLabeledLink[] {
	if (!items) return [];

	return items.reduce<ResolvedLabeledLink[]>((acc, item) => {
		if (!item?.label) return acc;
		const resolved = resolveLink(item.link);
		if (!resolved) return acc;
		acc.push({ label: item.label, ...resolved });
		return acc;
	}, []);
}

// Server component — deliberately NOT "use client" (this file used to be;
// see nav-client.tsx's comment for why the split exists). Fetching here
// keeps the mobile-menu interactivity client-side in NavClient while Nav
// itself stays a cheap server-rendered wrapper, same shape as Footer.
// Existing `<Nav />` call sites across app/** need no change — an async
// server component renders the same way a sync one does from a parent
// server component.
export async function Nav() {
	const siteSettings = await getSiteSettings();
	const logo = resolveBrandMarkLogo(siteSettings);

	// Per-collection fallback, not all-or-nothing: navLinks and headerCta
	// are independent fields on the same siteSettings document, so a
	// half-filled document (one configured, the other still blank) must
	// not blank out the half that IS configured. Each is checked and
	// resolved on its own below.
	const navLinks: ResolvedLabeledLink[] =
		siteSettings?.navLinks && siteSettings.navLinks.length > 0
			? resolveLabeledLinks(siteSettings.navLinks)
			: hardcodedNavLinks.map((link) => ({
					kind: "navigate" as const,
					label: link.label,
					href: link.href,
				}));

	// headerCta is a single `{ label, link }` object, not an array — wrapped
	// in a one-item array so it goes through the same resolve-and-drop path
	// as navLinks/footerColumns. `null` here (no label, or a link that fails
	// to resolve) means NavClient falls back to its own hardcoded CalButton
	// markup, kept byte-identical to today's for the unset case.
	const headerCta: ResolvedLabeledLink | null =
		resolveLabeledLinks(
			siteSettings?.headerCta ? [siteSettings.headerCta] : null
		)[0] ?? null;

	return <NavClient logo={logo} navLinks={navLinks} headerCta={headerCta} />;
}
