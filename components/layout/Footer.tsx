import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-[5%] py-12 md:py-18 lg:py-20">
      <div className="container">
        <div className="flex flex-col items-center pb-12 md:pb-18 lg:pb-20">
          <Link href="/" className="mb-8">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
              alt="Granite Marketing logo"
              className="inline-block"
            />
          </Link>
          <nav aria-label="Footer navigation">
            <ul className="grid grid-flow-row grid-cols-1 items-start justify-center justify-items-center gap-6 md:grid-flow-col md:grid-cols-[max-content] md:justify-center md:justify-items-start">
              <li className="font-semibold">
                <Link href="/about-us">About us</Link>
              </li>
              <li className="font-semibold">
                <Link href="/blog">Blog</Link>
              </li>
              <li className="font-semibold">
                <Link href="/contact-us">Contact us</Link>
              </li>
              <li className="font-semibold">
                <Link href="/#advanced-ocr">Advanced ocr</Link>
              </li>
              <li className="font-semibold">
                <Link href="/">Home</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="h-px w-full bg-black" />
        <div className="flex flex-col-reverse items-center justify-between pb-4 pt-6 text-center text-sm md:flex-row md:pb-0 md:pt-8">
          <p className="mt-8 md:mt-0">© 2024 Granite Marketing. All rights reserved.</p>
          <nav aria-label="Legal links">
            <ul className="grid grid-flow-row grid-cols-[max-content] justify-center gap-y-4 text-sm md:grid-flow-col md:gap-x-6 md:gap-y-0">
              <li className="underline decoration-black underline-offset-1">
                <Link href="/privacy">Privacy</Link>
              </li>
              <li className="underline decoration-black underline-offset-1">
                <Link href="/cookies">Cookies settings</Link>
              </li>
              <li className="underline decoration-black underline-offset-1">
                <Link href="/cookies">Cookies</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
