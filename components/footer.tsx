"use client";

import type React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const footerLinks = [
	{ label: "Services", href: "/#services" },
	{ label: "Results", href: "/#results" },
	{ label: "Process", href: "/#process" },
	{ label: "Testimonials", href: "/#testimonials" },
	{ label: "FAQs", href: "/#faq" },
	{ label: "Blog", href: "/blog" },
];

export function Footer() {
	const handleSmoothScroll = (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string
	) => {
		if (href.startsWith("/#")) {
			e.preventDefault();
			const id = href.substring(2);
			const element = document.getElementById(id);
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}
	};

	return (
		<footer className="bg-background border-t border-border py-16">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
					{/* Logo section */}
					<div>
						<Link
							href="/"
							className="flex items-center space-x-2 rounded-full overflow-hidden p-1 bg-white"
						>
							<Image
								src="/images/gm-logo.jpeg"
								alt="Logo brand logo for Granite Marketing. The logo is a simple, modern, and clean logo that is easy to recognize and remember."
								width={30}
								height={30}
								className="w-8 h-8 object-contain"
							/>
						</Link>
					</div>

					<nav>
						<ul className="flex flex-wrap gap-x-8 gap-y-3">
							{footerLinks.map((link) => (
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
