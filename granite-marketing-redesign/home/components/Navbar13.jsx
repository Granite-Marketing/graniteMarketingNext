"use client";

import { Button, useMediaQuery } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { RxChevronDown } from "react-icons/rx";

const useRelume = () => {
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const openOnMobileDropdownMenu = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  const openOnDesktopDropdownMenu = () => {
    !isMobile && setIsDropdownOpen(true);
  };
  const closeOnDesktopDropdownMenu = () => {
    !isMobile && setIsDropdownOpen(false);
  };
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const animateMobileMenu = isMobileMenuOpen ? "open" : "close";
  const animateDropdownMenu = isDropdownOpen ? "open" : "close";
  const animateDropdownMenuIcon = isDropdownOpen ? "rotate" : "initial";
  return {
    menuRef,
    buttonRef,
    toggleMobileMenu,
    openOnDesktopDropdownMenu,
    closeOnDesktopDropdownMenu,
    openOnMobileDropdownMenu,
    animateMobileMenu,
    animateDropdownMenu,
    animateDropdownMenuIcon,
  };
};

export function Navbar13() {
  const useActive = useRelume();
  return (
    <section
      id="relume"
      className="relative z-[999] mx-auto mt-5 flex w-full items-start justify-center bg-background-primary px-[5%] md:mt-6 lg:mx-[5%] lg:w-auto lg:px-0"
    >
      <div className="flex min-h-16 w-full items-center justify-between gap-4 border border-border-primary px-5 md:min-h-18 md:px-8 lg:w-auto">
        <a href="#">
          <img
            src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
            alt="Relume placeholder logo"
          />
        </a>
        <motion.div
          variants={{
            open: { height: "var(--height, 100vh)" },
            close: { height: "auto" },
          }}
          initial="close"
          exit="close"
          animate={useActive.animateMobileMenu}
          className="absolute left-0 right-0 top-full w-full overflow-hidden lg:static lg:left-auto lg:right-auto lg:top-auto lg:w-auto lg:overflow-visible lg:[--height:auto]"
        >
          <motion.div
            variants={{
              open: { y: 0 },
              close: { y: "var(--translate-y, -100%)" },
            }}
            animate={useActive.animateMobileMenu}
            initial="close"
            exit="close"
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 top-0 mx-auto min-w-[200px] justify-self-center bg-background-primary px-[5%] text-center lg:static lg:inset-auto lg:mx-0 lg:px-0 lg:text-left lg:[--translate-y:0%]"
          >
            <div
              ref={useActive.menuRef}
              className="flex w-full flex-col border border-t-0 border-border-primary bg-background-primary p-5 md:p-8 lg:w-auto lg:flex-row lg:border-none lg:bg-none lg:p-0"
              ref={useActive.menuRef}
            >
              <a
                href="#"
                className="relative block py-3 text-center text-md lg:px-4 lg:py-2 lg:text-left lg:text-base"
              >
                Services
              </a>
              <a
                href="#"
                className="relative block py-3 text-center text-md lg:px-4 lg:py-2 lg:text-left lg:text-base"
              >
                About us
              </a>
              <a
                href="#"
                className="relative block py-3 text-center text-md lg:px-4 lg:py-2 lg:text-left lg:text-base"
              >
                Blog
              </a>
              <div
                className="relative"
                onMouseEnter={useActive.openOnDesktopDropdownMenu}
                onMouseLeave={useActive.closeOnDesktopDropdownMenu}
              >
                <button
                  className="relative flex w-full items-center justify-center gap-4 whitespace-nowrap py-3 text-center text-md lg:gap-2 lg:px-4 lg:py-2 lg:text-left lg:text-base"
                  onClick={useActive.openOnMobileDropdownMenu}
                >
                  <span>Advanced OCR</span>
                  <motion.span
                    variants={{
                      rotate: { rotate: 180 },
                      initial: { rotate: 0 },
                    }}
                    animate={useActive.animateDropdownMenuIcon}
                    transition={{ duration: 0.3 }}
                  >
                    <RxChevronDown />
                  </motion.span>
                </button>
                <AnimatePresence>
                  <motion.nav
                    animate={useActive.animateDropdownMenu}
                    initial="close"
                    exit="close"
                    variants={{
                      open: {
                        opacity: "var(--opacity-open, 100%)",
                        y: "var(--translate-y-open, 0%)",
                        visibility: "visible",
                        height: "auto",
                      },
                      close: {
                        opacity: "var(--opacity-close, 100%)",
                        y: "var(--translate-y-close, 0%)",
                        visibility: "hidden",
                        height: "var(--height, 0)",
                      },
                    }}
                    transition={{ duration: 0.2 }}
                    className="static flex w-full min-w-full flex-col overflow-hidden whitespace-nowrap border-0 border-border-primary bg-background-primary p-0 lg:absolute lg:overflow-visible lg:border lg:p-2 lg:[--height:auto] lg:[--opacity-close:0%] lg:[--opacity-open:100%] lg:[--translate-y-close:25%] lg:[--translate-y-open:0%]"
                  >
                    <a
                      href="#"
                      className="px-0 py-3 text-center lg:px-4 lg:py-2 lg:text-left"
                    >
                      How it works
                    </a>
                    <a
                      href="#"
                      className="px-0 py-3 text-center lg:px-4 lg:py-2 lg:text-left"
                    >
                      Contact us
                    </a>
                    <a
                      href="#"
                      className="px-0 py-3 text-center lg:px-4 lg:py-2 lg:text-left"
                    >
                      Blog
                    </a>
                  </motion.nav>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
        <div className="flex items-center justify-center gap-4">
          <Button title="Start" size="sm">
            Start
          </Button>
          <button
            ref={useActive.buttonRef}
            className="-mr-2 flex size-12 flex-col items-center justify-center justify-self-end lg:hidden"
            onClick={useActive.toggleMobileMenu}
            ref={useActive.buttonRef}
          >
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-black"
              animate={useActive.animateMobileMenu}
              variants={{
                open: {
                  translateY: 8,
                  rotate: 45,
                  transition: { duration: 0.3 },
                },
                close: {
                  translateY: 0,
                  rotate: 0,
                  transition: { duration: 0.2 },
                },
              }}
            />
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-black"
              animate={useActive.animateMobileMenu}
              variants={{
                open: { opacity: 0, transition: { duration: 0.2 } },
                close: { opacity: 1, transition: { duration: 0.2 } },
              }}
            />
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-black"
              animate={useActive.animateMobileMenu}
              variants={{
                open: {
                  translateY: -8,
                  rotate: -45,
                  transition: { duration: 0.3 },
                },
                close: {
                  translateY: 0,
                  rotate: 0,
                  transition: { duration: 0.2 },
                },
              }}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
