"use client";

import React from "react";

export function Layout396() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Capabilities</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Three ways we build your advantage
          </h1>
          <p className="md:text-md">
            Connect everything you use. Granite Marketing links your tools
            seamlessly, creating workflows that speak the same language your
            business does.
          </p>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
          <div className="flex flex-col justify-center border border-border-primary p-6 md:p-8">
            <div>
              <div className="rb-5 mb-5 md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                  className="size-12"
                  alt="Relume logo 1"
                />
              </div>
              <h2 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                Seamless n8n integrations
              </h2>
              <p>Your systems work together without friction or custom code.</p>
            </div>
          </div>
          <div className="flex flex-col justify-center border border-border-primary p-6 md:p-8">
            <div>
              <div className="rb-5 mb-5 md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                  className="size-12"
                  alt="Relume logo 1"
                />
              </div>
              <h2 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                No-code workflow solutions
              </h2>
              <p>
                Build what you need without waiting for developers or learning
                to code.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center border border-border-primary p-6 md:p-8">
            <div>
              <div className="rb-5 mb-5 md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                  className="size-12"
                  alt="Relume logo 1"
                />
              </div>
              <h2 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                AI-powered data extraction
              </h2>
              <p>
                Pull the information that matters from documents and data
                sources automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
