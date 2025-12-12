import React from "react";
import { BiSolidStar } from "react-icons/bi";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "The automation runs while we sleep. What took three people all morning now happens in minutes.",
    author: "Sarah Mitchell",
    role: "Operations director, retail",
    avatar: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  },
  {
    quote:
      "We cut our data entry time in half. The automation handles what used to take our team hours every morning.",
    author: "James Chen",
    role: "CEO, logistics firm",
    avatar: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  },
  {
    quote:
      "Granite Marketing didn't just build us a tool. They understood our process and made it faster without changing how we work.",
    author: "Marcus Webb",
    role: "Operations lead, e-commerce",
    avatar: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  },
  {
    quote:
      "Granite Marketing built exactly what we needed without overcomplicating it. Our team reclaimed ten hours a week and never looked back.",
    author: "Elena Rodriguez",
    role: "Director, marketing agency",
    avatar: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  },
  {
    quote:
      "Setup was clean. Deployment was faster. The workflow just works the way we do.",
    author: "David Park",
    role: "Founder, SaaS startup",
    avatar: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  },
  {
    quote:
      "We stopped managing data entry and started managing growth instead.",
    author: "Priya Kapoor",
    role: "VP operations, finance",
    avatar: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <header className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Real results
          </h2>
          <p className="md:text-md">Teams that moved faster</p>
        </header>
        <div className="columns-1 gap-x-8 md:columns-2 lg:columns-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={index}
              className="mb-8 inline-block w-full border border-border-primary p-6 md:p-8"
            >
              <div className="mb-5 flex md:mb-6">
                {[...Array(5)].map((_, i) => (
                  <BiSolidStar key={i} className="mr-1 size-6" />
                ))}
              </div>
              <blockquote className="md:text-md">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-5 flex w-full flex-col items-start gap-4 md:mt-6 md:w-fit md:flex-row md:items-center">
                <img
                  src={testimonial.avatar}
                  alt={`${testimonial.author} avatar`}
                  className="size-12 min-h-12 min-w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <cite className="not-italic">{testimonial.role}</cite>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
