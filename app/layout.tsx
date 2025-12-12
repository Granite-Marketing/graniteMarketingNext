import type { Metadata, Viewport } from "next";
import "./globals.css";
import { defaultMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/seo";
import { Providers } from "@/components/providers";

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* JSON-LD structured data for organization and website */}
        <JsonLd data={[getOrganizationSchema(), getWebsiteSchema()]} />
      </head>
      <body>
        <Providers>
          <div className="page-wrapper">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
