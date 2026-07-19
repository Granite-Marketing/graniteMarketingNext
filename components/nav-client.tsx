"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandMark, type BrandMarkLogo } from "./brand-mark";
import { CalButton } from "./cal-button";
import { cn } from "@/lib/utils";
import type { ResolvedNavLink } from "@/lib/sanity/lib/resolve-site-settings";
import type { ResolvedLink } from "@/lib/sanity/lib/resolve-link";

// Mirrors CalButton's own class list (components/cal-button.tsx) — needed
// here because a `navigate`-kind headerCta (an editor pointing the header
// CTA at a page instead of the booking modal) has to render as a `<Link>`
// that still looks like the button CalButton draws for the `calBooking`
// case. Duplicated rather than exported from CalButton: that file isn't
// part of this unit's ownership (nav.tsx/nav-client.tsx/footer.tsx only),
// and its className already composes a caller override via `cn` the same
// way this does.
const CTA_BASE_CLASSES =
	"cursor-pointer rounded bg-relay-cyan font-mono font-semibold text-relay-bg transition-all hover:bg-relay-bright hover:shadow-[0_0_28px_rgba(63,198,220,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-relay-cyan";
const CTA_SIZE_CLASSES = {
	default: "px-4.5 py-2.5 text-xs",
	lg: "px-6 py-3.5 text-[13px]",
} as const;

/**
 * One resolved nav item, either kind. `kind: "calBooking"` renders via
 * CalButton — never as an `<a>` — exactly the distinction
 * lib/sanity/lib/resolve-link.ts's `ResolvedLink` union exists to force at
 * compile time (a `calBooking` value has no `href` to destructure by
 * mistake).
 */
function NavLink({
	link,
	className,
	onClick,
}: {
	link: ResolvedNavLink;
	className?: string;
	onClick?: () => void;
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
			onClick={onClick}
			target={link.target}
			rel={link.rel}
			className={className}
		>
			{link.label}
		</Link>
	);
}

/** The header CTA slot when siteSettings HAS one configured — see the
 * fallback branch inline below for the byte-identical-when-unset case. */
function HeaderCta({
	cta,
	size = "default",
	className,
}: {
	cta: ResolvedNavLink;
	size?: "default" | "lg";
	className?: string;
}) {
	if (cta.kind === "calBooking") {
		return (
			<CalButton calLink={cta.calLink} size={size} className={className}>
				{cta.label}
			</CalButton>
		);
	}

	return (
		<Link
			href={cta.href}
			target={cta.target}
			rel={cta.rel}
			className={cn(CTA_BASE_CLASSES, CTA_SIZE_CLASSES[size], className)}
		>
			{cta.label}
		</Link>
	);
}

/** Everything nav.tsx used to be, unchanged, minus the logo now arriving as
 * a prop instead of BrandMark rendering its default (no-logo) state. Split
 * out of nav.tsx (which stays the server component that fetches
 * siteSettings) because the mobile-menu open/close state needs `useState`,
 * and a "use client" component cannot itself be the async function that
 * awaits a Sanity fetch.
 *
 * `navLinks`/`headerCta`/`logoLink` arrive already resolved (nav.tsx calls
 * lib/sanity/lib/resolve-site-settings's resolvers) — this component renders
 * plain data, never a function or an unresolved link object, and never
 * fetches on its own. */
export function NavClient({
	logo,
	logoLink,
	navLinks,
	headerCta,
}: {
	logo: BrandMarkLogo | null;
	logoLink: ResolvedLink;
	navLinks: ResolvedNavLink[];
	headerCta: ResolvedNavLink | null;
}) {
	const [open, setOpen] = useState(false);
	const brandMark = (
		<>
			<BrandMark logo={logo} hideWordmarkOnMobile />
			<span className="sr-only">Granite Marketing home</span>
		</>
	);

	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-relay-line bg-relay-bg/85 backdrop-blur-md">
			<nav aria-label="Main" className="mx-auto container px-6">
				<div className="flex h-16 items-center gap-9">
					{logoLink.kind === "calBooking" ? (
						<CalButton
							calLink={logoLink.calLink}
							className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-relay-cyan"
						>
							{brandMark}
						</CalButton>
					) : (
						<Link
							href={logoLink.href}
							target={logoLink.target}
							rel={logoLink.rel}
							className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-relay-cyan"
						>
							{brandMark}
						</Link>
					)}

					<ul className="ml-auto hidden items-center gap-7 md:flex">
						{navLinks.map((link) => (
							<li key={link.label}>
								<NavLink
									link={link}
									className="font-mono text-[13px] text-relay-faint transition-colors hover:text-relay-cyan"
								/>
							</li>
						))}
					</ul>

					{headerCta ? (
						<HeaderCta cta={headerCta} className="hidden md:inline-flex" />
					) : (
						// Byte-identical to today's markup when siteSettings has no
						// headerCta — no calLink prop, so CalButton falls back to its
						// own default CAL_LINK, exactly as before this unit.
						<CalButton className="hidden md:inline-flex">
							book an intro call
						</CalButton>
					)}

					<button
						type="button"
						aria-expanded={open}
						aria-controls="relay-mobile-menu"
						onClick={() => setOpen((v) => !v)}
						className="ml-auto flex cursor-pointer flex-col gap-[5px] p-2.5 md:hidden"
					>
						<span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
						<span
							aria-hidden="true"
							className={`block h-0.5 w-5 rounded-full bg-relay-ink transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`}
						/>
						<span
							aria-hidden="true"
							className={`block h-0.5 w-5 rounded-full bg-relay-ink transition-opacity ${open ? "opacity-0" : ""}`}
						/>
						<span
							aria-hidden="true"
							className={`block h-0.5 w-5 rounded-full bg-relay-ink transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
						/>
					</button>
				</div>

				<div
					id="relay-mobile-menu"
					className={`${open ? "block" : "hidden"} border-t border-relay-line pb-7 pt-2 md:hidden`}
				>
					<ul>
						{navLinks.map((link) => (
							<li key={link.label} className="border-b border-relay-line">
								<NavLink
									link={link}
									onClick={() => setOpen(false)}
									className="block py-3.5 font-mono text-sm text-relay-faint transition-colors hover:text-relay-cyan"
								/>
							</li>
						))}
					</ul>
					{headerCta ? (
						<HeaderCta cta={headerCta} size="lg" className="mt-5 w-full" />
					) : (
						// Byte-identical to today's markup when siteSettings has no
						// headerCta — same fallback rule as the desktop button above.
						<CalButton size="lg" className="mt-5 w-full">
							Book an intro call
						</CalButton>
					)}
				</div>
			</nav>
		</header>
	);
}
