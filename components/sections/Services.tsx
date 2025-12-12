import React from "react";

export function Services() {
  return (
    <section id="services" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <header className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Capabilities</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Three ways we build your advantage
          </h2>
          <p className="md:text-md">
            Connect everything you use. Granite Marketing links your tools
            seamlessly, creating workflows that speak the same language your
            business does.
          </p>
        </header>
        <div className="grid auto-cols-fr grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
          <article className="flex flex-col justify-center border border-border-primary p-6 md:p-8">
            <div>
              <div className="rb-5 mb-5 md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                  className="size-12"
                  alt="Integration icon"
                />
              </div>
              <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                Seamless n8n integrations
              </h3>
              <p>Your systems work together without friction or custom code.</p>
            </div>
          </article>
          <article className="flex flex-col justify-center border border-border-primary p-6 md:p-8">
            <div>
              <div className="rb-5 mb-5 md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                  className="size-12"
                  alt="No-code icon"
                />
              </div>
              <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                No-code workflow solutions
              </h3>
              <p>
                Build what you need without waiting for developers or learning
                to code.
              </p>
            </div>
          </article>
          <article className="flex flex-col justify-center border border-border-primary p-6 md:p-8">
            <div>
              <div className="rb-5 mb-5 md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                  className="size-12"
                  alt="AI extraction icon"
                />
              </div>
              <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                AI-powered data extraction
              </h3>
              <p>
                Pull the information that matters from documents and data
                sources automatically.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
