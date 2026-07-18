import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { draftMode } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { VisualEditing } from "next-sanity/visual-editing";
import "./globals.css";
import { defaultMetadata } from "@/lib/seo/config";
import { SanityLive } from "@/lib/sanity/live";
import { DisableDraftMode } from "@/components/disable-draft-mode";

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist",
	display: "swap",
});
const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
	display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { isEnabled: isDraftMode } = await draftMode();

	return (
		<html lang="en" className="dark">
			<body
				className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
			>
				{/* Google Analytics */}
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-YE1QR36KST"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-YE1QR36KST');
					`}
				</Script>
				{children}
				<Analytics />
				{/*
					Draft-gated so anonymous traffic keeps its existing ISR behaviour
					and never opens a live connection.

					<VisualEditing /> is the comlink bridge to the Studio — it powers
					the connection, refresh, and the "Documents on this page" list. It
					must always be present in Draft Mode, or Presentation reports
					"Unable to connect to visual editing".

					The env flag controls only *stega*, i.e. whether content carries
					click-to-edit targets. Bridge and overlays are separate concerns.
				*/}
				{isDraftMode && (
					<>
						<SanityLive />
						<VisualEditing />
						<DisableDraftMode />
					</>
				)}
			</body>
		</html>
	);
}
