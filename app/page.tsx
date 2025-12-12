import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import LogoMarquee from "@/components/sections/LogoMarquee";
import Stats from "@/components/sections/Stats";
import Timeline from "@/components/sections/Timeline";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import ContactForm from "@/components/sections/ContactForm";
import CTA from "@/components/sections/CTA";
import JsonLd from "@/components/seo/JsonLd";
import { generatePageMetadata, getServiceSchema, getFAQSchema } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("home");

// FAQ data for structured data
const faqData = [
  {
    question: "What kinds of automations do you build?",
    answer: "We specialize in no-code and low-code automations using tools like n8n, Make, Zapier, and custom scripts. From lead generation and content publishing to AI agents and data pipelines — if it can be automated, we can build it.",
  },
  {
    question: "How long does it take to build an automation?",
    answer: "Most projects take 1-3 weeks from kickoff to deployment. Simple integrations can be done in days, while complex multi-system automations may take longer.",
  },
  {
    question: "Do I need technical knowledge to use your automations?",
    answer: "Not at all. We design everything to be user-friendly and provide full documentation. If you can click a button, you can use our automations.",
  },
  {
    question: "What happens if something breaks?",
    answer: "All our automations include monitoring and error handling. If something goes wrong, we'll know about it before you do. Our support packages include troubleshooting and fixes.",
  },
  {
    question: "Can you integrate with my existing tools?",
    answer: "Almost certainly. We work with hundreds of apps and services, from CRMs and project management tools to AI platforms and databases. If your tool has an API, we can connect it.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Structured data for homepage */}
      <JsonLd data={[getServiceSchema(), getFAQSchema(faqData)]} />
      
      <Header />
      <main id="main" className="main-wrapper">
        <Hero />
        <LogoMarquee />
        <Stats />
        <Timeline />
        <Testimonials />
        <FAQ />
        <ContactForm />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
