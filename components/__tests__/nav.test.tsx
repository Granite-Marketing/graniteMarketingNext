import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

// Nav is a server component (see nav.tsx's comment on why it isn't
// "use client" despite the mobile-menu interactivity living in NavClient) —
// exercised the same way app/__tests__/page.test.tsx exercises Home:
// `await Nav()` then render the resolved JSX.
const getSiteSettings = vi.fn();
vi.mock("@/lib/sanity/queries", () => ({
	getSiteSettings: (...args: unknown[]) => getSiteSettings(...args),
}));

import { Nav } from "../nav";

beforeEach(() => {
	vi.clearAllMocks();
});

afterEach(cleanup);

describe("Nav", () => {
	it("renders the inline SVG wordmark when siteSettings has no logo — today's behaviour", async () => {
		getSiteSettings.mockResolvedValue({ logo: null });

		const jsx = await Nav();
		const { container } = render(jsx);

		expect(screen.getByText("granite")).toBeDefined();
		expect(container.querySelector("img")).toBeNull();
	});

	it("renders the uploaded logo image when siteSettings.logo is set", async () => {
		getSiteSettings.mockResolvedValue({
			logo: {
				asset: { _ref: "image-abc123-800x200-png", _type: "reference" },
				altText: "Acme Corp",
			},
		});

		const jsx = await Nav();
		render(jsx);

		expect(screen.getByAltText("Acme Corp")).toBeDefined();
		expect(screen.queryByText("granite")).toBeNull();
	});

	it("falls back to a non-empty alt when altText is empty", async () => {
		getSiteSettings.mockResolvedValue({
			logo: {
				asset: { _ref: "image-abc123-800x200-png", _type: "reference" },
				altText: "",
			},
		});

		const jsx = await Nav();
		render(jsx);

		const img = screen.getByRole("img");
		expect(img.getAttribute("alt")).not.toBe("");
		expect(img.getAttribute("alt")?.length).toBeGreaterThan(0);
	});

	it("hides the wordmark on mobile in the SVG path, matching today's nav", async () => {
		getSiteSettings.mockResolvedValue({ logo: null });

		const jsx = await Nav();
		render(jsx);

		const wordmark = screen.getByText("granite");
		expect(wordmark.className).toContain("hidden");
		expect(wordmark.className).toContain("md:inline");
	});
});
