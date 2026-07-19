"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandMark, type BrandMarkLogo } from "./brand-mark";
import { CalButton } from "./cal-button";
import { navLinks } from "./data";

/** Everything nav.tsx used to be, unchanged, minus the logo now arriving as
 * a prop instead of BrandMark rendering its default (no-logo) state. Split
 * out of nav.tsx (which stays the server component that fetches
 * siteSettings) because the mobile-menu open/close state needs `useState`,
 * and a "use client" component cannot itself be the async function that
 * awaits a Sanity fetch. */
export function NavClient({ logo }: { logo: BrandMarkLogo | null }) {
	const [open, setOpen] = useState(false);

	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-relay-line bg-relay-bg/85 backdrop-blur-md">
			<nav aria-label="Main" className="mx-auto container px-6">
				<div className="flex h-16 items-center gap-9">
					<Link
						href="/"
						className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-relay-cyan"
					>
						<BrandMark logo={logo} hideWordmarkOnMobile />
						<span className="sr-only">Granite Marketing home</span>
					</Link>

					<ul className="ml-auto hidden items-center gap-7 md:flex">
						{navLinks.map((link) => (
							<li key={link.label}>
								<Link
									href={link.href}
									className="font-mono text-[13px] text-relay-faint transition-colors hover:text-relay-cyan"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>

					<CalButton className="hidden md:inline-flex">
						book an intro call
					</CalButton>

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
								<Link
									href={link.href}
									onClick={() => setOpen(false)}
									className="block py-3.5 font-mono text-sm text-relay-faint transition-colors hover:text-relay-cyan"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
					<CalButton size="lg" className="mt-5 w-full">
						Book an intro call
					</CalButton>
				</div>
			</nav>
		</header>
	);
}
