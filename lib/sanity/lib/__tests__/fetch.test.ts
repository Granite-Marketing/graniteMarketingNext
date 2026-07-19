import { beforeEach, describe, expect, it, vi } from "vitest";

// fetchQuery is the single chokepoint every query in the app goes through
// (lib/sanity/lib/fetch.ts). It had no direct test coverage before U14 of
// the Sanity page builder plan, despite every `*_SLUGS_QUERY` fetcher
// (blog posts, workflow templates, case studies, and now pages) resting its
// "never emit a draft-only static route, never leak stega" guarantee on it.
//
// This is the layer that actually enforces U14's non-negotiable: passing
// `forcePublished: true` must force the published, `stega: false` branch —
// the one place zero-width click-to-edit characters can never reach a URL
// segment — regardless of whether Draft Mode happens to be active.

const draftModeMock = vi.fn();
vi.mock("next/headers", () => ({
	draftMode: () => draftModeMock(),
}));

const clientFetchMock = vi.fn();
vi.mock("../../client", () => ({
	client: { fetch: (...args: unknown[]) => clientFetchMock(...args) },
}));

const sanityFetchMock = vi.fn();
vi.mock("../../live", () => ({
	hasReadToken: true,
	sanityFetch: (...args: unknown[]) => sanityFetchMock(...args),
}));

import { fetchQuery } from "../fetch";

const QUERY = `*[_type == "page"].slug.current`;

beforeEach(() => {
	vi.clearAllMocks();
	clientFetchMock.mockResolvedValue(["published-slug"]);
	sanityFetchMock.mockResolvedValue({ data: ["draft-slug"] });
});

describe("fetchQuery — forcePublished forces the published, stega:false path", () => {
	it("forcePublished:true takes the published path even while Draft Mode is active", async () => {
		draftModeMock.mockResolvedValue({ isEnabled: true });

		await fetchQuery(QUERY, {}, { forcePublished: true });

		expect(sanityFetchMock).not.toHaveBeenCalled();
		expect(clientFetchMock).toHaveBeenCalledTimes(1);

		const [, , options] = clientFetchMock.mock.calls[0];
		expect(options).toMatchObject({ perspective: "published", stega: false });
	});

	it("without forcePublished, an active draft session (with a read token) takes the live, stega-capable path instead", async () => {
		draftModeMock.mockResolvedValue({ isEnabled: true });

		await fetchQuery(QUERY, {});

		expect(clientFetchMock).not.toHaveBeenCalled();
		expect(sanityFetchMock).toHaveBeenCalledTimes(1);
	});

	it("without forcePublished, an inactive draft session still resolves the published, stega:false path", async () => {
		draftModeMock.mockResolvedValue({ isEnabled: false });

		await fetchQuery(QUERY, {});

		expect(sanityFetchMock).not.toHaveBeenCalled();
		const [, , options] = clientFetchMock.mock.calls[0];
		expect(options).toMatchObject({ perspective: "published", stega: false });
	});

	it("forcePublished:true never reads draftMode() at all — it short-circuits before the check", async () => {
		await fetchQuery(QUERY, {}, { forcePublished: true });

		expect(draftModeMock).not.toHaveBeenCalled();
	});
});
