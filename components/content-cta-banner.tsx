import { CTA } from "@/components/cta";

interface ContentCtaBannerProps {
	heading?: string;
	subtitle?: string;
	/** Retained for API compatibility; the CTA now opens the Cal.com modal. */
	ctaText?: string;
	/** Retained for API compatibility; the CTA now opens the Cal.com modal. */
	ctaHref?: string;
}

/**
 * Content pages now share the Relay intro-call panel so every CTA
 * on the site looks and behaves the same (Cal.com popup modal).
 */
export function ContentCtaBanner({
	heading = "Ready to automate your workflows",
	subtitle = "Get practical workflows built for your business. No coding required, just results that matter.",
}: ContentCtaBannerProps) {
	return <CTA heading={heading} subtitle={subtitle} />;
}
