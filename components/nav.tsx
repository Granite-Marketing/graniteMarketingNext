import { resolveBrandMarkLogo } from "./brand-mark";
import { NavClient } from "./nav-client";
import { getSiteSettings } from "@/lib/sanity/queries";

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

	return <NavClient logo={logo} />;
}
