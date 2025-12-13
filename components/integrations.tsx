"use client"

export function Integrations() {
  const integrations = [
    "Webflow",
    "Relume",
    "Notion",
    "Slack",
    "Airtable",
    "OpenAI",
    "Stripe",
    "Gmail",
    "Zapier",
    "HubSpot",
  ]

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8">Built on the tools that power modern business</p>

        <div className="relative mb-6">
          <div className="flex animate-scroll-left gap-12 mb-8">
            {/* Duplicate the array twice for seamless loop */}
            {[...integrations, ...integrations].map((integration, index) => (
              <div key={index} className="flex items-center gap-2 opacity-60 flex-shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L3 8v8l9 8 9-8V8L12 0zm0 3.2L18.4 8 12 12.8 5.6 8 12 3.2z" />
                </svg>
                <span className="font-semibold text-lg whitespace-nowrap">{integration}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="flex animate-scroll-right gap-12">
            {/* Duplicate the array twice for seamless loop */}
            {[...integrations, ...integrations].map((integration, index) => (
              <div key={index} className="flex items-center gap-2 opacity-60 flex-shrink-0">
                <div className="w-6 h-6 bg-current rounded"></div>
                <span className="font-semibold text-lg whitespace-nowrap">{integration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
