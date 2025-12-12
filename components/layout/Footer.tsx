import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact-form", label: "FAQs" },
  { href: "/contact-us", label: "Contact Us" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookies" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black">
      <div className="px-6 py-16 md:py-24">
        <div className="container">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pb-12 md:pb-16">
            <Link href="/" aria-label="Granite Marketing - Home">
              <Image
                src="/images/logo.avif"
                alt=""
                width={48}
                height={41}
              />
            </Link>

            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-4 md:gap-8">
                {footerLinks.map((link) => (
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
            </nav>
          </div>

          <hr className="border-neutral-dark" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6">
            <small className="text-neutral-light">
              © {currentYear} Granite Marketing. All rights reserved.
            </small>
            
            <ul className="flex gap-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-light hover:text-brand-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
