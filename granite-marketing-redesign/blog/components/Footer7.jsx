"use client";

import React from "react";

export function Footer7() {
  return (
    <footer id="relume" className="px-[5%] py-12 md:py-18 lg:py-20">
      <div className="container">
        <div className="flex flex-col items-center pb-12 md:pb-18 lg:pb-20">
          <a href="#" className="mb-8">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
              alt="Logo image"
              className="inline-block"
            />
          </a>
          <ul className="grid grid-flow-row grid-cols-1 items-start justify-center justify-items-center gap-6 md:grid-flow-col md:grid-cols-[max-content] md:justify-center md:justify-items-start">
            <li className="font-semibold">
              <a href="#">About us</a>
            </li>
            <li className="font-semibold">
              <a href="#">Blog</a>
            </li>
            <li className="font-semibold">
              <a href="#">Contact us</a>
            </li>
            <li className="font-semibold">
              <a href="#">Advanced ocr</a>
            </li>
            <li className="font-semibold">
              <a href="#">Home</a>
            </li>
          </ul>
        </div>
        <div className="h-px w-full bg-black" />
        <div className="flex flex-col-reverse items-center justify-between pb-4 pt-6 text-center text-sm md:flex-row md:pb-0 md:pt-8">
          <p className="mt-8 md:mt-0">© 2024 Relume. All rights reserved.</p>
          <ul className="grid grid-flow-row grid-cols-[max-content] justify-center gap-y-4 text-sm md:grid-flow-col md:gap-x-6 md:gap-y-0">
            <li className="underline decoration-black underline-offset-1">
              <a href="#">Privacy</a>
            </li>
            <li className="underline decoration-black underline-offset-1">
              <a href="#">Cookies settings</a>
            </li>
            <li className="underline decoration-black underline-offset-1">
              <a href="#">Cookies</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
