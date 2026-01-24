"use client";

import type React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

type FooterClientProps = {
	logo: React.ReactNode;
};

export function FooterClient({ logo }: FooterClientProps) {
	const pathname = usePathname();
	const router = useRouter();

	// Handle hash scrolling after navigation
	useEffect(() => {
		if (pathname === "/" && window.location.hash) {
			const hash = window.location.hash.substring(1);
			const element = document.getElementById(hash);
			if (element) {
				// Small delay to ensure page is fully rendered
				setTimeout(() => {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
				}, 100);
			}
		}
	}, [pathname]);

	const handleSmoothScroll = (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string
	) => {
		if (href.startsWith("/#")) {
			const id = href.substring(2);
			
			// If on homepage, prevent default and scroll
			if (pathname === "/") {
				e.preventDefault();
				const element = document.getElementById(id);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
				}
			} else {
				// If on another page, navigate to homepage with hash
				// The useEffect will handle scrolling after navigation
				e.preventDefault();
				router.push(href);
			}
		}
	};

	return (
		<footer className="bg-background border-t border-border py-16">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
					{/* Logo section */}
					<div>
						<Link
							href="/"
							className="flex items-center rounded-full border border-border/60 overflow-hidden"
						>
							{logo}
						</Link>
					</div>

					<nav>
						<ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
							{[
								{ label: "Services", href: "/#services" },
								{ label: "Results", href: "/#results" },
								{ label: "Process", href: "/#process" },
								{ label: "Testimonials", href: "/#testimonials" },
								{ label: "FAQs", href: "/#faq" },
								{ label: "Blog", href: "/blog" },
							].map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										onClick={(e) => handleSmoothScroll(e, link.href)}
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>

				<Separator className="mb-8" />

				<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
					<div>
						© {new Date().getFullYear()} Granite Marketing. All rights reserved.
					</div>
					<div className="flex gap-6">
						<Link
							href="/privacy"
							className="hover:text-foreground transition-colors"
						>
							Privacy
						</Link>
						<Link
							href="/cookies"
							className="hover:text-foreground transition-colors"
						>
							Cookies
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
