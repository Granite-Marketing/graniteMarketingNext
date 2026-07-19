import Link from "next/link";
import Image from "next/image";
import { BrandMark, resolveBrandMarkLogo } from "./brand-mark";
import { complianceLinks, footerColumns as hardcodedFooterColumns } from "./data";
import { getSiteSettings } from "@/lib/sanity/queries";
import { CalButton } from "./cal-button";
import {
	resolveFooterColumns,
	resolveLogoLink,
} from "@/lib/sanity/lib/resolve-site-settings";
import type {
	ResolvedFooterColumn,
	ResolvedNavLink,
} from "@/lib/sanity/lib/resolve-site-settings";

// P1 findings #7/#4 fix: this file used to inline its own `{ heading, links
// }` mapping against `resolveLink` directly, and hardcoded the logo's
// `<Link href="/">` — duplicating, and never calling,
// lib/sanity/lib/resolve-site-settings.ts's `resolveFooterColumns`/
// `resolveLogoLink`. Footer now resolves through those shared functions
// (nav.tsx does the same for navLinks/headerCta/logoLink), so an editor's
// `siteSettings.logoLink` actually reaches this render site.

/**
 * One resolved footer link, either kind. Mirrors nav-client.tsx's `NavLink`
 * — a `calBooking` link renders via CalButton, never as an `<a>`, same
 * reasoning (lib/sanity/lib/resolve-link.ts's `ResolvedLink` union). Kept as
 * its own small component here (not imported from nav-client.tsx) because
 * that file is "use client" and Footer has no interactivity of its own to
 * justify the boundary.
 */
function FooterLink({
	link,
	className,
}: {
	link: ResolvedNavLink;
	className?: string;
}) {
	if (link.kind === "calBooking") {
		return (
			<CalButton calLink={link.calLink} className={className}>
				{link.label}
			</CalButton>
		);
	}

	return (
		<Link
			href={link.href}
			target={link.target}
			rel={link.rel}
			className={className}
		>
			{link.label}
		</Link>
	);
}

// Server component — the fetch below is the single round trip Footer needs
// for the logo (getSiteSettings projects the whole siteSettings singleton,
// but only `logo` is consumed here today). Async server components render
// fine from the many `<Footer />` call sites across app/** with no change
// needed there.
export async function Footer() {
	const siteSettings = await getSiteSettings();
	const logo = resolveBrandMarkLogo(siteSettings);
	const logoLink = resolveLogoLink(siteSettings?.logoLink);

	// Per-collection fallback, same rule as nav.tsx's navLinks/headerCta:
	// footerColumns is its own independent field on siteSettings, so it
	// falls back to components/data.ts on its own rather than being tied to
	// whether navLinks/headerCta are configured. A column is kept only if
	// it has a heading; its links are resolved (and dangling ones dropped)
	// the same way nav.tsx resolves navLinks — both go through
	// resolve-site-settings.ts's shared resolvers now.
	const footerColumns: ResolvedFooterColumn[] =
		siteSettings?.footerColumns && siteSettings.footerColumns.length > 0
			? resolveFooterColumns(siteSettings.footerColumns)
			: hardcodedFooterColumns.map((column) => ({
					heading: column.heading,
					links: column.links.map((link) => ({
						kind: "navigate" as const,
						label: link.label,
						href: link.href,
					})),
				}));

	return (
		<footer className="border-t border-relay-line">
			<div className="mx-auto container px-6">
				<div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
					<div>
						{logoLink.kind === "calBooking" ? (
							<CalButton
								calLink={logoLink.calLink}
								className="inline-block"
							>
								<BrandMark logo={logo} />
								<span className="sr-only">Granite Marketing home</span>
							</CalButton>
						) : (
							<Link
								href={logoLink.href}
								target={logoLink.target}
								rel={logoLink.rel}
								className="inline-block"
							>
								<BrandMark logo={logo} />
								<span className="sr-only">Granite Marketing home</span>
							</Link>
						)}
						<p className="mt-4 max-w-64 text-sm leading-relaxed text-relay-faint">
							AI automations and custom systems for lean teams who&apos;d
							rather grow the business than run it by hand.
						</p>
					</div>

					{footerColumns.map((column) => (
						<nav key={column.heading} aria-label={column.heading}>
							<h2 className="mb-4.5 font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-relay-faint">
								{column.heading}
							</h2>
							<ul className="flex flex-col gap-0.5">
								{column.links.map((link) => (
									<li key={link.label}>
										<FooterLink
											link={link}
											className="inline-block py-1.5 text-sm text-relay-body transition-colors hover:text-relay-cyan"
										/>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>

				{/* Wise compliance bar: wording, card logos and policy links must stay intact. */}
				<div className="flex flex-col items-center justify-between gap-4 border-t border-relay-line py-6 text-sm text-relay-faint md:flex-row">
					<div className="flex items-center gap-4">
						<span>
							© {new Date().getFullYear()} Granite Marketing. All rights
							reserved.
						</span>
						<div className="flex items-center gap-2">
							<Image
								src="/images/logos/visa.svg"
								alt="Visa accepted"
								width={40}
								height={26}
								className="h-6 w-auto"
							/>
							<Image
								src="/images/logos/mastercard.svg"
								alt="Mastercard accepted"
								width={40}
								height={26}
								className="h-6 w-auto"
							/>
						</div>
					</div>
					<ul className="flex flex-wrap gap-6">
						{complianceLinks.map((link) => (
							<li key={link.label}>
								<Link
									href={link.href}
									className="transition-colors hover:text-relay-cyan"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	);
}
