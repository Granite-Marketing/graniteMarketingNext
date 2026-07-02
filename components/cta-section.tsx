import { RelayCTA } from "@/components/relay/cta";

/**
 * Site-wide CTA now renders the Relay intro-call panel with the
 * Cal.com popup modal, matching the homepage. The previous inline
 * calendar embed lives in git history if we ever need it back.
 */
export function CTASection() {
	return <RelayCTA />;
}
