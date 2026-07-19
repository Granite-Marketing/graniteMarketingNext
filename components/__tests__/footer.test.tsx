import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

// Footer is a server component (unchanged in that respect) — exercised the
// same way app/__tests__/page.test.tsx exercises Home: `await Footer()` then
// render the resolved JSX.
const getSiteSettings = vi.fn();
vi.mock("@/lib/sanity/queries", () => ({
	getSiteSettings: (...args: unknown[]) => getSiteSettings(...args),
}));

import { Footer } from "../footer";

beforeEach(() => {
	vi.clearAllMocks();
});

afterEach(cleanup);

describe("Footer", () => {
	it("renders the inline SVG wordmark when siteSettings has no logo — today's behaviour", async () => {
		getSiteSettings.mockResolvedValue({ logo: null });

		const jsx = await Footer();
		const { container } = render(jsx);

		expect(screen.getByText("granite")).toBeDefined();
		// The compliance bar's Visa/Mastercard <img>s always render — only the
		// brand-mark slot (no accessible name matching either card scheme)
		// must stay logo-free.
		const brandImage = screen
			.getAllByRole("img")
			.find(
				(img) =>
					!["Visa accepted", "Mastercard accepted"].includes(
						img.getAttribute("alt") ?? ""
					)
			);
		expect(brandImage).toBeUndefined();
		expect(container.querySelector("svg")).not.toBeNull();
	});

	it("renders the uploaded logo image when siteSettings.logo is set", async () => {
		getSiteSettings.mockResolvedValue({
			logo: {
				asset: { _ref: "image-abc123-800x200-png", _type: "reference" },
				altText: "Acme Corp",
			},
		});

		const jsx = await Footer();
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

		const jsx = await Footer();
		render(jsx);

		// Two <img> elements always render in the footer (Visa/Mastercard in
		// the compliance bar) — find the brand-mark one specifically rather
		// than assuming it's the only image on the page.
		const images = screen.getAllByRole("img");
		const brandImage = images.find(
			(img) => !["Visa accepted", "Mastercard accepted"].includes(
				img.getAttribute("alt") ?? ""
			)
		);
		expect(brandImage).toBeDefined();
		expect(brandImage?.getAttribute("alt")).not.toBe("");
		expect(brandImage?.getAttribute("alt")?.length).toBeGreaterThan(0);
	});
});
