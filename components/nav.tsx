import { resolveBrandMarkLogo } from "./brand-mark";
import { NavClient } from "./nav-client";
import { getSiteSettings } from "@/lib/sanity/queries";
import {
	resolveNavLinks,
	resolveLogoLink,
} from "@/lib/sanity/lib/resolve-site-settings";
import type { ResolvedNavLink } from "@/lib/sanity/lib/resolve-site-settings";
import { navLinks as hardcodedNavLinks } from "./data";

// U22 of the Sanity page builder plan — nav (and footer.tsx, importing the
// same shared resolvers directly) renders its links from `siteSettings`
// when it has them, and from today's hardcoded components/data.ts when it
// does not.
//
// P1 finding #7 fix: this file used to hand-roll its own `resolveLabeledLinks`
// against `resolveLink` directly — footer.tsx inlined an equivalent mapping
// of its own — duplicating lib/sanity/lib/resolve-site-settings.ts's
// `resolveNavLinks`/`resolveFooterColumns` almost line for line. That shared
// module had its own passing test file but zero production call sites. Nav
// and Footer now both resolve through it instead of carrying two copies of
// the same "map through resolveLink, drop what fails" logic; `ResolvedNavLink`
// is the one `{ label } & ResolvedLink` shape both nav-client.tsx and
// footer.tsx render.
//
// P1 finding #4 fix: `siteSettings.logoLink` was schema'd, seeded and
// projected in GROQ, with `resolveLogoLink` fully implemented — but both
// render sites hardcoded `href="/"` instead of resolving it. Nav now
// resolves it here and threads the result into NavClient.

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
	const logoLink = resolveLogoLink(siteSettings?.logoLink);

	// Per-collection fallback, not all-or-nothing: navLinks and headerCta
	// are independent fields on the same siteSettings document, so a
	// half-filled document (one configured, the other still blank) must
	// not blank out the half that IS configured. Each is checked and
	// resolved on its own below.
	const navLinks: ResolvedNavLink[] =
		siteSettings?.navLinks && siteSettings.navLinks.length > 0
			? resolveNavLinks(siteSettings.navLinks)
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
	const headerCta: ResolvedNavLink | null =
		resolveNavLinks(
			siteSettings?.headerCta ? [siteSettings.headerCta] : null
		)[0] ?? null;

	return (
		<NavClient
			logo={logo}
			logoLink={logoLink}
			navLinks={navLinks}
			headerCta={headerCta}
		/>
	);
}
