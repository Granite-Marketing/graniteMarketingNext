import { beforeEach, describe, expect, it, vi } from "vitest";

// Finding #9 of the fetchQuery-typing review: getFeaturedLogos used to
// return `Promise<unknown>` (fetchQuery had no type argument), which both
// app/page.tsx and app/[slug]/page.tsx papered over with an
// `as unknown as ClientLogo[]` double-cast. That cast erased checking
// entirely and hid a real defect — logoList.clientName is only required at
// publish time in the Studio (logoList.ts's `Rule.required()`), so typegen
// correctly types the projected field as `string | null`. A document with
// neither `clientName` nor `logo.alt` set would flow straight through to
// next/image's `alt` prop in components/hero.tsx
// (`client.logo.alt || client.clientName`), producing `alt={null}`.
//
// The fix resolves the nullability once, in the getter, rather than
// re-casting at every call site: getFeaturedLogos now coalesces a missing
// `clientName` to a real string before returning.

const fetchQueryMock = vi.fn();
vi.mock("../lib/fetch", () => ({
	fetchQuery: (...args: unknown[]) => fetchQueryMock(...args),
}));

import { getFeaturedLogos, FEATURED_LOGOS_QUERY } from "../queries";

beforeEach(() => {
	vi.clearAllMocks();
});

describe("getFeaturedLogos", () => {
	it("fetches with the configured limit", async () => {
		fetchQueryMock.mockResolvedValue([]);

		await getFeaturedLogos(5);

		expect(fetchQueryMock).toHaveBeenCalledWith(FEATURED_LOGOS_QUERY, {
			limit: 5,
		});
	});

	it("falls back clientName to a non-null string when a document has neither clientName nor logo.alt", async () => {
		fetchQueryMock.mockResolvedValue([
			{
				_id: "logo-1",
				clientName: null,
				slug: null,
				logo: { asset: { _ref: "image-abc", _type: "reference" }, alt: null },
				website: null,
			},
		]);

		const logos = await getFeaturedLogos();

		expect(logos).toHaveLength(1);
		expect(logos[0].clientName).not.toBeNull();
		expect(typeof logos[0].clientName).toBe("string");
		// components/hero.tsx renders `client.logo.alt || client.clientName` as
		// next/image's `alt` prop — this is the value that would have landed
		// there. It must be a real, non-empty string, never null.
		expect(logos[0].logo?.alt ?? logos[0].clientName).toBeTruthy();
	});

	it("prefers the real clientName when it is set", async () => {
		fetchQueryMock.mockResolvedValue([
			{
				_id: "logo-2",
				clientName: "Acme Co",
				slug: null,
				logo: null,
				website: null,
			},
		]);

		const logos = await getFeaturedLogos();

		expect(logos[0].clientName).toBe("Acme Co");
	});

	it("normalises a missing logo.alt to undefined rather than null, matching ClientLogo's optional alt", async () => {
		fetchQueryMock.mockResolvedValue([
			{
				_id: "logo-3",
				clientName: "Acme Co",
				slug: null,
				logo: { asset: { _ref: "image-def", _type: "reference" }, alt: null },
				website: null,
			},
		]);

		const logos = await getFeaturedLogos();

		expect(logos[0].logo?.alt).toBeUndefined();
	});

	it("normalises a missing website to undefined rather than null", async () => {
		fetchQueryMock.mockResolvedValue([
			{
				_id: "logo-4",
				clientName: "Acme Co",
				slug: null,
				logo: null,
				website: null,
			},
		]);

		const logos = await getFeaturedLogos();

		expect(logos[0].website).toBeUndefined();
	});
});
