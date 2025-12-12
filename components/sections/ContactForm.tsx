"use client";

import { useState, FormEvent } from "react";
import { EmailIcon, LocationIcon } from "@/components/icons";

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Placeholder for form submission
      // In production, this would send to an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", company: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" aria-labelledby="contact-heading">
      <div className="px-6 padding-section-large">
        <div className="container max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Info */}
          <div>
            <h2 id="contact-heading" className="heading-style-h2 mb-6">
              Let&apos;s Work Together
            </h2>
            <p className="text-size-medium text-brand-off-white mb-8">
              Ready to automate your workflows and scale your operations? 
              Tell us about your project and we&apos;ll get back to you within 24 hours.
            </p>
            
            <address className="not-italic space-y-4">
              <p className="flex items-center gap-3 text-brand-off-white">
                <EmailIcon size={20} className="text-brand-green flex-shrink-0" />
                <a href="mailto:hello@granitemarketing.com" className="hover:text-brand-green transition-colors">
                  hello@granitemarketing.com
                </a>
              </p>
              <p className="flex items-center gap-3 text-brand-off-white">
                <LocationIcon size={20} className="text-brand-green flex-shrink-0" />
                <span>Remote-first, serving clients worldwide</span>
              </p>
            </address>
          </div>

          {/* Right Column - Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-white mb-2">
                Your Name <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                placeholder="John Smith"
                className="w-full px-4 py-3 bg-neutral-darker border border-neutral-dark rounded-lg text-brand-white placeholder-neutral-light focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-white mb-2">
                Email Address <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="john@company.com"
                className="w-full px-4 py-3 bg-neutral-darker border border-neutral-dark rounded-lg text-brand-white placeholder-neutral-light focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-brand-white mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                autoComplete="organization"
                placeholder="Your Company"
                className="w-full px-4 py-3 bg-neutral-darker border border-neutral-dark rounded-lg text-brand-white placeholder-neutral-light focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-brand-white mb-2">
                Tell us about your project <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="What workflows would you like to automate? What tools are you currently using?"
                className="w-full px-4 py-3 bg-neutral-darker border border-neutral-dark rounded-lg text-brand-white placeholder-neutral-light focus:outline-none focus:border-brand-green transition-colors resize-none"
              />
            </div>

            {submitStatus === "success" && (
              <div role="alert" className="p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-400">
                Thank you! We&apos;ll be in touch within 24 hours.
              </div>
            )}

            {submitStatus === "error" && (
              <div role="alert" className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
                Something went wrong. Please try again or email us directly.
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-green hover:bg-brand-green-light disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium px-6 py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
