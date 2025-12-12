"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";

const navLinks = [
  { href: "/about-us", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact-form", label: "FAQs" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md">
      <div className="px-6">
        <div className="container flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" aria-label="Granite Marketing - Home">
            <Image
              src="/images/logo.avif"
              alt=""
              width={48}
              height={41}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-off-white hover:text-brand-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/contact-us"
              className="bg-brand-green hover:bg-brand-green-light text-black font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
            <span className="w-6 h-5 flex flex-col justify-between" aria-hidden="true">
              <span
                className={clsx(
                  "w-full h-0.5 bg-white transition-transform duration-300 origin-center",
                  isMenuOpen && "rotate-45 translate-y-2"
                )}
              />
              <span
                className={clsx(
                  "w-full h-0.5 bg-white transition-opacity duration-300",
                  isMenuOpen && "opacity-0"
                )}
              />
              <span
                className={clsx(
                  "w-full h-0.5 bg-white transition-transform duration-300 origin-center",
                  isMenuOpen && "-rotate-45 -translate-y-2"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        id="mobile-menu"
        aria-label="Mobile navigation"
        className={clsx(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!isMenuOpen}
      >
        <div className="px-6 py-6 border-t border-neutral-dark">
          <ul className="flex flex-col gap-4 mb-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-brand-off-white hover:text-brand-white transition-colors text-lg py-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact-us"
            onClick={() => setIsMenuOpen(false)}
            className="inline-block bg-brand-green hover:bg-brand-green-light text-black font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
