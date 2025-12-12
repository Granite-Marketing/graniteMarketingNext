import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="main-wrapper pt-24 min-h-screen flex items-center">
        <section className="section-404 w-full">
          <div className="px-6 padding-section-large">
            <div className="container max-w-4xl text-center">
              <div className="mb-8">
                <span className="text-8xl md:text-9xl font-bold text-brand-green font-heading">
                  404
                </span>
              </div>
              <h1 className="heading-style-h2 mb-4">Page Not Found</h1>
              <p className="text-size-medium text-brand-off-white mb-8 max-w-md mx-auto">
                Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/">Go Home</Button>
                <Button href="/contact-us" variant="secondary">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
