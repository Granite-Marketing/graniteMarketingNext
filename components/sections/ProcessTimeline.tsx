import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { VideoIframe } from "@/components/ui/VideoIframe";
import { FaCirclePlay } from "react-icons/fa6";

export function ProcessTimeline() {
  return (
    <section id="process" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <Tabs
          defaultValue="tab-one"
          className="grid grid-cols-1 items-center gap-y-12 md:grid-cols-2 md:gap-x-12 lg:gap-x-20"
        >
          <div className="max-size-full order-last flex items-center justify-center overflow-hidden md:order-first">
            <TabsContent value="tab-one">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Process step 1"
                className="size-full object-cover"
              />
            </TabsContent>
            <TabsContent value="tab-two">
              <Dialog>
                <DialogTrigger className="relative flex w-full items-center justify-center">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg"
                    alt="Process step 2 video"
                    className="size-full object-cover"
                  />
                  <FaCirclePlay className="absolute z-20 size-16 text-white" />
                  <span className="absolute inset-0 z-10 bg-black/50" />
                </DialogTrigger>
                <DialogContent>
                  <VideoIframe video="https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW" />
                </DialogContent>
              </Dialog>
            </TabsContent>
            <TabsContent value="tab-three">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Process step 3"
                className="size-full object-cover"
              />
            </TabsContent>
          </div>
          <TabsList className="order-first flex-col gap-8 py-8 md:order-last md:py-0">
            <TabsTrigger
              value="tab-one"
              className="flex-col items-start whitespace-normal border-0 border-l-2 border-transparent bg-transparent py-0 pl-8 pr-0 text-left data-[state=active]:border-l-border-primary data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
            >
              <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                Map it out
              </h3>
              <p>
                We listen to how your team moves through each day and find where
                time gets lost.
              </p>
            </TabsTrigger>
            <TabsTrigger
              value="tab-two"
              className="flex-col items-start whitespace-normal border-0 border-l-2 border-transparent bg-transparent py-0 pl-8 pr-0 text-left data-[state=active]:border-l-border-primary data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
            >
              <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                Build it
              </h3>
              <p>
                We create the automation that fits your workflow, not the other way around.
              </p>
            </TabsTrigger>
            <TabsTrigger
              value="tab-three"
              className="flex-col items-start whitespace-normal border-0 border-l-2 border-transparent bg-transparent py-0 pl-8 pr-0 text-left data-[state=active]:border-l-border-primary data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
            >
              <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                Deploy it
              </h3>
              <p>
                Your team starts using it immediately, with support when you need it.
              </p>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </section>
  );
}
