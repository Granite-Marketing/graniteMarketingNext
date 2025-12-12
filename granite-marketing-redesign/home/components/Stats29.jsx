"use client";

import { Button } from "@relume_io/relume-ui";
import React, { Fragment } from "react";
import { RxChevronRight } from "react-icons/rx";

export function Stats29() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 gap-y-5 md:mb-18 md:grid-cols-2 md:gap-x-12 lg:mb-20 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">Track record</p>
            <h2 className="text-5xl font-bold md:text-7xl lg:text-8xl">
              Built and proven across industries
            </h2>
          </div>
          <div>
            <p className="md:text-md">
              We've delivered automations that stick. Real workflows for real
              teams. The numbers speak to what happens when you build something
              that actually solves the problem.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button title="Learn" variant="secondary">
                Learn
              </Button>
              <Button
                title="Arrow"
                variant="link"
                size="link"
                iconRight={<RxChevronRight />}
              >
                Arrow
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Fragment>
            <div className="border border-border-primary p-8 first:flex first:flex-col first:md:col-span-2 first:md:row-span-1 first:lg:col-span-1 first:lg:row-span-2">
              <p className="mb-8 text-10xl font-bold leading-[1.3] md:mb-10 md:text-[4rem] lg:mb-12 lg:text-[5rem]">
                20+
              </p>
              <h3 className="text-md font-bold leading-[1.4] md:text-xl mt-auto">
                Automations deployed
              </h3>
              <p className="mt-2">
                Custom workflows built across industries and tools
              </p>
            </div>
          </Fragment>
          <Fragment>
            <div>
              <img
                className="aspect-[3/2] size-full object-cover"
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
              />
            </div>
          </Fragment>
          <Fragment>
            <div className="border border-border-primary p-8">
              <p className="mb-8 text-10xl font-bold leading-[1.3] md:mb-10 md:text-[4rem] lg:mb-12 lg:text-[5rem]">
                20+
              </p>
              <h3 className="text-md font-bold leading-[1.4] md:text-xl">
                Automations deployed
              </h3>
              <p className="mt-2">
                Custom workflows built across industries and tools
              </p>
            </div>
          </Fragment>
          <Fragment>
            <div className="border border-border-primary p-8 [&:nth-last-child(2)]:order-last [&:nth-last-child(2)]:md:order-none">
              <p className="mb-8 text-10xl font-bold leading-[1.3] md:mb-10 md:text-[4rem] lg:mb-12 lg:text-[5rem]">
                20+
              </p>
              <h3 className="text-md font-bold leading-[1.4] md:text-xl">
                Automations deployed
              </h3>
              <p className="mt-2">
                Custom workflows built across industries and tools
              </p>
            </div>
          </Fragment>
          <Fragment>
            <div>
              <img
                className="aspect-[3/2] size-full object-cover"
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
              />
            </div>
          </Fragment>
        </div>
      </div>
    </section>
  );
}
