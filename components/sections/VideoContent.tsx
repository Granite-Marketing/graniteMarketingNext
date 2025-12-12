import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { VideoIframe } from "@/components/ui/VideoIframe";
import { FaCirclePlay } from "react-icons/fa6";
import { RxChevronRight } from "react-icons/rx";

export function VideoContent() {
  return (
    <section id="publishing" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
          <article>
            <p className="mb-3 font-semibold md:mb-4">Publishing</p>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Publish faster and stay consistent
            </h2>
            <p className="md:text-md">
              We built custom n8n automations that handle the repetitive work of
              content management. Your team publishes more, stays on schedule,
              and reclaims hours each week without learning new systems or
              changing how you already work.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button title="Explore" variant="secondary" asChild>
                <Link href="/#services">Explore</Link>
              </Button>
              <Button
                title="Arrow"
                variant="secondary"
                className="flex items-center gap-2"
                asChild
              >
                <Link href="/blog">
                  Learn more <RxChevronRight />
                </Link>
              </Button>
            </div>
          </article>
          <figure className="relative flex w-full max-w-full items-center justify-center">
            <Dialog>
              <DialogTrigger className="relative flex w-full max-w-full items-center justify-center">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg"
                  className="w-full object-cover"
                  alt="Video thumbnail"
                />
                <FaCirclePlay className="absolute z-20 size-16 text-white" />
                <span className="absolute inset-0 z-10 bg-black/50" />
              </DialogTrigger>
              <DialogContent>
                <VideoIframe video="https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW" />
              </DialogContent>
            </Dialog>
          </figure>
        </div>
      </div>
    </section>
  );
}
