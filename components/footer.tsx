import { RelayFooter } from "@/components/relay/footer";

/**
 * Site-wide footer now renders the Relay redesign, including the
 * Wise compliance bar (copyright, card logos, policy links).
 * The previous implementation is preserved in footer-client.tsx
 * in case we need to roll back.
 */
export function Footer() {
	return <RelayFooter />;
}
