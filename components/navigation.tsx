"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const navLinks = [
	{ href: "/#services", label: "Services" },
	// { href: "/#about", label: "About Us" },
	{ href: "/#results", label: "Results" },
	{ href: "/#process", label: "Process" },
	{ href: "/#testimonials", label: "Testimonials" },
	{ href: "/#faq", label: "FAQs" },
	{ href: "/blog", label: "Blog" },
];

export function Navigation() {
	const pathname = usePathname();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setIsMounted(true);
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
		// Only intercept hash links when on homepage
		if (href.startsWith("/#") && pathname === "/") {
			e.preventDefault();
			const id = href.substring(2);
			const element = document.getElementById(id);
			if (element) {
				// Scroll with offset for fixed header
				const headerOffset = 100;
				const elementPosition = element.getBoundingClientRect().top;
				const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				});
			}
		}
		// If on other pages, let browser handle navigation naturally
	};

	const handleNavClick = (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string
	) => {
		handleSmoothScroll(e, href);
		setIsOpen(false); // Close mobile menu
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
				<Link
					href="/"
					className="flex items-center rounded-full border border-border/60 overflow-hidden"
				>
					<Image
						src="/images/granite-marketing-new-logo.png"
						alt="Logo brand logo for Granite Marketing. The logo is a simple, modern, and clean logo that is easy to recognize and remember."
						width={48}
						height={48}
						className="w-12 h-12 object-contain"
					/>
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
							Get Started
						</Link>
					</Button>
				</div>

				{/* Mobile Navigation */}
				{isMounted && (
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild className="md:hidden">
							<Button variant="ghost" size="icon">
								<Menu className="h-6 w-6" />
								<span className="sr-only">Open menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px]">
							<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
							<div className="flex flex-col space-y-6 mt-8 p-8">
								{navLinks.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										onClick={(e) => handleNavClick(e, link.href)}
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
										onClick={(e) => handleNavClick(e, "/#contact")}
									>
										Get Started
									</Link>
								</Button>
							</div>
						</SheetContent>
					</Sheet>
				)}
			</nav>
		</header>
	);
}
