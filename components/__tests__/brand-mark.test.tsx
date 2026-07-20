import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { BrandMark, resolveBrandMarkLogo } from "../brand-mark";

// The regression this guards: an editor uploads a logo in siteSettings and
// nothing happens, because Nav/Footer hardcoded the inline SVG wordmark and
// never looked at the field. BrandMark now renders whichever of the two
// `resolveBrandMarkLogo` hands it — SVG wordmark when there's no logo (the
// case today, and the one that must stay byte-identical), the uploaded image
// otherwise.

afterEach(cleanup);

describe("BrandMark", () => {
	it("renders the inline SVG wordmark when no logo is set", () => {
		const { container } = render(<BrandMark />);

		expect(screen.getByText("granite")).toBeDefined();
		expect(container.querySelector("svg")).not.toBeNull();
		expect(container.querySelector("img")).toBeNull();
	});

	it("renders the uploaded logo image, with no SVG, when a logo is set", () => {
		const { container } = render(
			<BrandMark
				logo={{
					url: "https://cdn.sanity.io/images/proj/ds/logo.png",
					alt: "Acme Corp",
					width: 160,
					height: 40,
				}}
			/>
		);

		const img = screen.getByAltText("Acme Corp");
		expect(img).toBeDefined();
		expect(container.querySelector("svg")).toBeNull();
		expect(screen.queryByText("granite")).toBeNull();
	});

	it("keeps hideWordmarkOnMobile working in the SVG fallback path", () => {
		const { container: shown } = render(<BrandMark />);
		expect(shown.querySelector("span.hidden")).toBeNull();
		cleanup();

		const { container: hidden } = render(<BrandMark hideWordmarkOnMobile />);
		const wordmark = screen.getByText("granite");
		expect(wordmark.className).toContain("hidden");
		expect(wordmark.className).toContain("md:inline");
		expect(hidden).toBeDefined();
	});

	it("hideWordmarkOnMobile has no effect once a logo replaces the SVG path", () => {
		// There is no wordmark text to hide once an image is rendering — the
		// prop simply has nothing left to do, rather than needing separate
		// handling on the image branch.
		render(
			<BrandMark
				hideWordmarkOnMobile
				logo={{
					url: "https://cdn.sanity.io/images/proj/ds/logo.png",
					alt: "Acme Corp",
					width: 160,
					height: 40,
				}}
			/>
		);

		expect(screen.getByAltText("Acme Corp")).toBeDefined();
		expect(screen.queryByText("granite")).toBeNull();
	});
});

describe("resolveBrandMarkLogo", () => {
	it("returns null when siteSettings has no logo asset", () => {
		expect(resolveBrandMarkLogo(null)).toBeNull();
		expect(resolveBrandMarkLogo({ logo: null })).toBeNull();
		expect(resolveBrandMarkLogo({ logo: { asset: null } })).toBeNull();
	});

	it("uses the document's altText when a logo asset is present", () => {
		const result = resolveBrandMarkLogo({
			logo: {
				asset: {
					_ref: "image-abc123-800x200-png",
					_type: "reference",
				},
				altText: "Acme Corp",
			},
		});

		expect(result).not.toBeNull();
		expect(result?.alt).toBe("Acme Corp");
		expect(result?.url).toContain("cdn.sanity.io");
	});

	it("falls back to a non-empty alt when altText is empty, never an empty string", () => {
		const emptyString = resolveBrandMarkLogo({
			logo: {
				asset: { _ref: "image-abc123-800x200-png", _type: "reference" },
				altText: "",
			},
		});
		const missing = resolveBrandMarkLogo({
			logo: {
				asset: { _ref: "image-abc123-800x200-png", _type: "reference" },
			},
		});

		expect(emptyString?.alt).not.toBe("");
		expect(emptyString?.alt.length).toBeGreaterThan(0);
		expect(missing?.alt).not.toBe("");
		expect(missing?.alt.length).toBeGreaterThan(0);
	});

	it("gives the resolved logo explicit, non-zero dimensions", () => {
		const result = resolveBrandMarkLogo({
			logo: {
				asset: { _ref: "image-abc123-800x200-png", _type: "reference" },
				altText: "Acme Corp",
			},
		});

		expect(result?.width).toBeGreaterThan(0);
		expect(result?.height).toBeGreaterThan(0);
	});
});
