"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { gsap, useGSAP } from "@/lib/animations/gsap-config";
import { RxChevronDown } from "react-icons/rx";

export function Header() {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuInnerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLElement>(null);
  const dropdownIconRef = useRef<HTMLSpanElement>(null);
  const hamburgerTopRef = useRef<HTMLSpanElement>(null);
  const hamburgerMiddleRef = useRef<HTMLSpanElement>(null);
  const hamburgerBottomRef = useRef<HTMLSpanElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const openOnMobileDropdownMenu = () => setIsDropdownOpen((prev) => !prev);
  const openOnDesktopDropdownMenu = () => {
    if (!isMobile) setIsDropdownOpen(true);
  };
  const closeOnDesktopDropdownMenu = () => {
    if (!isMobile) setIsDropdownOpen(false);
  };

  // Click outside handler
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mobile menu animations with GSAP
  useGSAP(
    () => {
      if (!mobileMenuRef.current || !mobileMenuInnerRef.current) return;

      if (isMobileMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          height: "100vh",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(mobileMenuInnerRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(mobileMenuRef.current, {
          height: "auto",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(mobileMenuInnerRef.current, {
          y: "-100%",
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    { scope: mobileMenuRef, dependencies: [isMobileMenuOpen] }
  );

  // Dropdown menu animations with GSAP
  useGSAP(
    () => {
      if (!dropdownRef.current) return;

      if (isDropdownOpen) {
        gsap.to(dropdownRef.current, {
          opacity: 1,
          y: 0,
          visibility: "visible",
          height: "auto",
          duration: 0.2,
          ease: "power2.out",
        });
      } else {
        if (isMobile) {
          gsap.to(dropdownRef.current, {
            opacity: 1,
            y: 0,
            visibility: "hidden",
            height: 0,
            duration: 0.2,
            ease: "power2.out",
          });
        } else {
          gsap.to(dropdownRef.current, {
            opacity: 0,
            y: "25%",
            visibility: "hidden",
            height: "auto",
            duration: 0.2,
            ease: "power2.out",
          });
        }
      }
    },
    { scope: dropdownRef, dependencies: [isDropdownOpen, isMobile] }
  );

  // Dropdown icon rotation
  useGSAP(
    () => {
      if (!dropdownIconRef.current) return;
      gsap.to(dropdownIconRef.current, {
        rotate: isDropdownOpen ? 180 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    { scope: dropdownIconRef, dependencies: [isDropdownOpen] }
  );

  // Hamburger icon animations
  useGSAP(
    () => {
      if (!hamburgerTopRef.current || !hamburgerMiddleRef.current || !hamburgerBottomRef.current) return;

      if (isMobileMenuOpen) {
        gsap.to(hamburgerTopRef.current, {
          translateY: 8,
          rotate: 45,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(hamburgerMiddleRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.out",
        });
        gsap.to(hamburgerBottomRef.current, {
          translateY: -8,
          rotate: -45,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(hamburgerTopRef.current, {
          translateY: 0,
          rotate: 0,
          duration: 0.2,
          ease: "power2.out",
        });
        gsap.to(hamburgerMiddleRef.current, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        });
        gsap.to(hamburgerBottomRef.current, {
          translateY: 0,
          rotate: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    },
    {
      scope: hamburgerTopRef,
      dependencies: [isMobileMenuOpen],
    }
  );

  return (
    <header className="relative z-[999] mx-auto mt-5 flex w-full items-start justify-center bg-background-primary px-[5%] md:mt-6 lg:mx-[5%] lg:w-auto lg:px-0">
      <div className="flex min-h-16 w-full items-center justify-between gap-4 border border-border-primary px-5 md:min-h-18 md:px-8 lg:w-auto">
        <Link href="/">
          <img
            src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
            alt="Granite Marketing logo"
          />
        </Link>
        <div
          ref={mobileMenuRef}
          className="absolute left-0 right-0 top-full w-full overflow-hidden lg:static lg:left-auto lg:right-auto lg:top-auto lg:w-auto lg:overflow-visible lg:h-auto"
        >
          <div
            ref={mobileMenuInnerRef}
            className="absolute left-0 right-0 top-0 mx-auto min-w-[200px] justify-self-center bg-background-primary px-[5%] text-center lg:static lg:inset-auto lg:mx-0 lg:px-0 lg:text-left lg:translate-y-0 lg:opacity-100"
          >
            <nav
              ref={menuRef}
              className="flex w-full flex-col border border-t-0 border-border-primary bg-background-primary p-5 md:p-8 lg:w-auto lg:flex-row lg:border-none lg:bg-none lg:p-0"
            >
              <ul className="flex w-full flex-col gap-0 lg:flex-row lg:items-center lg:gap-0">
                <li>
                  <Link
                    href="/#services"
                    className="relative block py-3 text-center text-md lg:px-4 lg:py-2 lg:text-left lg:text-base"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about-us"
                    className="relative block py-3 text-center text-md lg:px-4 lg:py-2 lg:text-left lg:text-base"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="relative block py-3 text-center text-md lg:px-4 lg:py-2 lg:text-left lg:text-base"
                  >
                    Blog
                  </Link>
                </li>
                <li
                  className="relative"
                  onMouseEnter={openOnDesktopDropdownMenu}
                  onMouseLeave={closeOnDesktopDropdownMenu}
                >
                  <button
                    type="button"
                    className="relative flex w-full items-center justify-center gap-4 whitespace-nowrap py-3 text-center text-md lg:gap-2 lg:px-4 lg:py-2 lg:text-left lg:text-base"
                    onClick={openOnMobileDropdownMenu}
                  >
                    <span>Advanced OCR</span>
                    <span ref={dropdownIconRef} className="inline-block">
                      <RxChevronDown />
                    </span>
                  </button>
                  <nav
                    ref={dropdownRef}
                    className="static flex w-full min-w-full flex-col overflow-hidden whitespace-nowrap border-0 border-border-primary bg-background-primary p-0 lg:absolute lg:overflow-visible lg:border lg:p-2 lg:opacity-0 lg:invisible lg:translate-y-[25%]"
                  >
                    <Link
                      href="/#how-it-works"
                      className="px-0 py-3 text-center lg:px-4 lg:py-2 lg:text-left"
                    >
                      How it works
                    </Link>
                    <Link
                      href="/contact-us"
                      className="px-0 py-3 text-center lg:px-4 lg:py-2 lg:text-left"
                    >
                      Contact us
                    </Link>
                    <Link
                      href="/blog"
                      className="px-0 py-3 text-center lg:px-4 lg:py-2 lg:text-left"
                    >
                      Blog
                    </Link>
                  </nav>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button title="Start" size="sm">
            Start
          </Button>
          <button
            ref={buttonRef}
            type="button"
            className="-mr-2 flex size-12 flex-col items-center justify-center justify-self-end lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span
              ref={hamburgerTopRef}
              className="my-[3px] h-0.5 w-6 bg-black"
            />
            <span
              ref={hamburgerMiddleRef}
              className="my-[3px] h-0.5 w-6 bg-black"
            />
            <span
              ref={hamburgerBottomRef}
              className="my-[3px] h-0.5 w-6 bg-black"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
