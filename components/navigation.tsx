"use client";

import type React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
	{ href: "/#services", label: "Services" },
	// { href: "/#about", label: "About Us" },
	{ href: "/#process", label: "Process" },
	{ href: "/#testimonials", label: "Testimonials" },
	{ href: "/#results", label: "Results" },
	{ href: "/#faq", label: "FAQs" },
	{ href: "/blog", label: "Blog" },
];

export function Navigation() {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

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
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled
					? "bg-background/95 backdrop-blur-sm border-b border-border"
					: "bg-transparent"
			}`}
		>
			<nav className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link href="/" className="flex items-center space-x-2">
					<span className="font-bold text-xl italic">Logo</span>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center space-x-8">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={(e) => handleSmoothScroll(e, link.href)}
							className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
						>
							{link.label}
						</Link>
					))}
				</div>

				<div className="hidden md:flex items-center">
					<Button
						variant="default"
						size="sm"
						className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 shadow-lg hover:shadow-xl transition-all"
						asChild
					>
						<Link
							href="/#contact"
							onClick={(e) => handleSmoothScroll(e, "/#contact")}
						>
							Start
						</Link>
					</Button>
				</div>

				{/* Mobile Navigation */}
				<Sheet>
					<SheetTrigger asChild className="md:hidden">
						<Button variant="ghost" size="icon">
							<Menu className="h-6 w-6" />
							<span className="sr-only">Open menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-[300px]">
						<div className="flex flex-col space-y-6 mt-8 p-8">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={(e) => handleSmoothScroll(e, link.href)}
									className="text-lg font-medium hover:text-primary transition-colors"
								>
									{link.label}
								</Link>
							))}
							<Button
								variant="default"
								asChild
								className="w-full rounded-full bg-primary text-primary-foreground font-semibold shadow-lg"
							>
								<Link
									href="/#contact"
									onClick={(e) => handleSmoothScroll(e, "/#contact")}
								>
									Start
								</Link>
							</Button>
						</div>
					</SheetContent>
				</Sheet>
			</nav>
		</header>
	);
}
