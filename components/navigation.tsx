import { RelayNav } from "@/components/relay/nav";

/**
 * Site-wide navigation now renders the Relay redesign.
 * The previous implementation is preserved in navigation-client.tsx
 * in case we need to roll back.
 */
export function Navigation() {
	return <RelayNav />;
}
