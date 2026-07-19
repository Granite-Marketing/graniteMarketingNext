import { beforeEach, describe, expect, it, vi } from "vitest";

// siteSettings' four SEO/social fields (U9's schema —
// lib/sanity/studio-schemas/documents/siteSettings.ts) were seeded with real
// values but lib/seo/config.ts was entirely hardcoded and nothing read them.
// This suite pins the fix: getRootMetadata() must read them through
// getSiteSettings() (lib/sanity/queries.ts), each falling back to today's
// hardcoded value independently, byte-identical to the old static
// `defaultMetadata` export whenever a field is unset.
//
// Mocking convention mirrors app/__tests__/page.test.tsx — mock the query
// module, import the function under test after the mock is registered.
const getSiteSettings = vi.fn();

vi.mock("@/lib/sanity/queries", () => ({
	getSiteSettings: (...args: unknown[]) => getSiteSettings(...args),
}));

import { defaultMetadata, siteConfig, getRootMetadata } from "../config";

// @vercel/stega's VERCEL_STEGA_REGEX (the implementation stegaClean uses)
// matches runs of 4-or-more characters drawn from its zero-width code-point
// set — mirrors app/__tests__/page.test.tsx's STEGA_MARKER exactly.
const STEGA_MARKER = "​​​​";

const OG_ASSET_REF = "image-abc123-1200x630-png";
const FAVICON_ASSET_REF = "image-fav123-512x512-png";

function emptySiteSettings() {
	return {
		logo: null,
		logoLink: null,
		navLinks: null,
		headerCta: null,
		footerColumns: null,
		ctaHeading: null,
		ctaSubtitle: null,
		ctaButton: null,
		ctaFootnote: null,
		siteTitle: null,
		siteDescription: null,
		ogImage: null,
		favicon: null,
	};
}

beforeEach(() => {
	vi.clearAllMocks();
});

describe("getRootMetadata — nothing set", () => {
	it("produces today's exact title, description, OG image and icon set when siteSettings has none of the four fields filled in", async () => {
		getSiteSettings.mockResolvedValue(emptySiteSettings());

		const metadata = await getRootMetadata();

		expect(metadata.title).toEqual(defaultMetadata.title);
		expect(metadata.description).toBe(defaultMetadata.description);
		expect(metadata.openGraph?.images).toEqual(defaultMetadata.openGraph?.images);
		expect(metadata.twitter?.images).toEqual(defaultMetadata.twitter?.images);
		expect(metadata.icons).toEqual(defaultMetadata.icons);
	});

	it("produces the same result when the siteSettings document itself is null — the published/draft-only case this unit exists for", async () => {
		getSiteSettings.mockResolvedValue(null);

		const metadata = await getRootMetadata();

		expect(metadata.title).toEqual(defaultMetadata.title);
		expect(metadata.description).toBe(defaultMetadata.description);
		expect(metadata.openGraph?.images).toEqual(defaultMetadata.openGraph?.images);
		expect(metadata.icons).toEqual(defaultMetadata.icons);
	});

	it("keeps every other defaultMetadata field (robots, verification, manifest, alternates, keywords) untouched", async () => {
		getSiteSettings.mockResolvedValue(emptySiteSettings());

		const metadata = await getRootMetadata();

		expect(metadata.robots).toEqual(defaultMetadata.robots);
		expect(metadata.verification).toEqual(defaultMetadata.verification);
		expect(metadata.manifest).toEqual(defaultMetadata.manifest);
		expect(metadata.alternates).toEqual(defaultMetadata.alternates);
		expect(metadata.keywords).toEqual(defaultMetadata.keywords);
	});
});

describe("getRootMetadata — per-field fallback", () => {
	it("overrides only the title default when siteTitle is set, keeping description/OG image/icons at their defaults", async () => {
		getSiteSettings.mockResolvedValue({
			...emptySiteSettings(),
			siteTitle: "Custom Site Title",
		});

		const metadata = await getRootMetadata();

		expect(metadata.title).toEqual({
			default: "Custom Site Title",
			// The template must never move — see the decision comment on
			// getRootMetadata in config.ts. Only the default title is
			// editor-controlled; a per-page title still gets " | Granite
			// Marketing" stamped onto it exactly as it does today.
			template: (defaultMetadata.title as { template: string }).template,
		});
		expect(metadata.description).toBe(defaultMetadata.description);
		expect(metadata.openGraph?.images).toEqual(defaultMetadata.openGraph?.images);
		expect(metadata.icons).toEqual(defaultMetadata.icons);
	});

	it("overrides only the description when siteDescription is set, keeping title/OG image/icons at their defaults", async () => {
		getSiteSettings.mockResolvedValue({
			...emptySiteSettings(),
			siteDescription: "Custom site description.",
		});

		const metadata = await getRootMetadata();

		expect(metadata.description).toBe("Custom site description.");
		expect(metadata.title).toEqual(defaultMetadata.title);
		expect(metadata.openGraph?.images).toEqual(defaultMetadata.openGraph?.images);
		expect(metadata.icons).toEqual(defaultMetadata.icons);
	});

	it("overrides only the OG/Twitter image when ogImage is set, keeping title/description/icons at their defaults", async () => {
		getSiteSettings.mockResolvedValue({
			...emptySiteSettings(),
			ogImage: {
				asset: { _ref: OG_ASSET_REF, _type: "reference" },
				altText: "A custom share image",
			},
		});

		const metadata = await getRootMetadata();

		expect(metadata.title).toEqual(defaultMetadata.title);
		expect(metadata.description).toBe(defaultMetadata.description);
		expect(metadata.icons).toEqual(defaultMetadata.icons);
		expect(metadata.openGraph?.images).not.toEqual(defaultMetadata.openGraph?.images);
	});

	it("overrides only the icon set when favicon is set, keeping title/description/OG image at their defaults", async () => {
		getSiteSettings.mockResolvedValue({
			...emptySiteSettings(),
			favicon: { asset: { _ref: FAVICON_ASSET_REF, _type: "reference" } },
		});

		const metadata = await getRootMetadata();

		expect(metadata.title).toEqual(defaultMetadata.title);
		expect(metadata.description).toBe(defaultMetadata.description);
		expect(metadata.openGraph?.images).toEqual(defaultMetadata.openGraph?.images);
		expect(metadata.icons).not.toEqual(defaultMetadata.icons);
	});
});

describe("getRootMetadata — ogImage", () => {
	it("builds the OG/Twitter image URL from the uploaded asset and uses its altText", async () => {
		getSiteSettings.mockResolvedValue({
			...emptySiteSettings(),
			ogImage: {
				asset: { _ref: OG_ASSET_REF, _type: "reference" },
				altText: "A custom share image",
			},
		});

		const metadata = await getRootMetadata();
		const [image] = metadata.openGraph?.images as Array<{
			url: string;
			width: number;
			height: number;
			alt: string;
		}>;

		expect(image.url).toContain("cdn.sanity.io");
		expect(image.url).toContain("abc123");
		expect(image.url).toContain("w=1200");
		expect(image.url).toContain("h=630");
		expect(image.alt).toBe("A custom share image");
		expect(metadata.twitter?.images).toEqual([image.url]);
	});

	it("falls back to the site's resolved title as alt text when altText is left empty", async () => {
		getSiteSettings.mockResolvedValue({
			...emptySiteSettings(),
			siteTitle: "Custom Site Title",
			ogImage: { asset: { _ref: OG_ASSET_REF, _type: "reference" }, altText: null },
		});

		const metadata = await getRootMetadata();
		const [image] = metadata.openGraph?.images as Array<{ alt: string }>;

		expect(image.alt).toBe("Custom Site Title");
	});
});

describe("getRootMetadata — favicon", () => {
	it("derives every raster icon size from the single uploaded asset and leaves the SVG entry unchanged", async () => {
		getSiteSettings.mockResolvedValue({
			...emptySiteSettings(),
			favicon: { asset: { _ref: FAVICON_ASSET_REF, _type: "reference" } },
		});

		const metadata = await getRootMetadata();
		const icons = metadata.icons as {
			icon: Array<{ url: string; sizes?: string; type?: string }>;
			apple: Array<{ url: string; sizes?: string }>;
		};

		// Sanity's image pipeline cannot emit an SVG from a raster upload — this
		// entry must stay exactly as it is today regardless of what's uploaded.
		expect(icons.icon[0]).toEqual({ url: "/icon.svg", type: "image/svg+xml" });

		expect(icons.icon[1].url).toContain("cdn.sanity.io");
		expect(icons.icon[1].url).toContain("fav123");

		expect(icons.icon[2].url).toContain("w=32");
		expect(icons.icon[2].url).toContain("h=32");
		expect(icons.icon[2].sizes).toBe("32x32");
		expect(icons.icon[2].type).toBe("image/png");

		expect(icons.icon[3].url).toContain("w=16");
		expect(icons.icon[3].url).toContain("h=16");
		expect(icons.icon[3].sizes).toBe("16x16");
		expect(icons.icon[3].type).toBe("image/png");

		expect(icons.apple[0].url).toContain("w=180");
		expect(icons.apple[0].url).toContain("h=180");
		expect(icons.apple[0].sizes).toBe("180x180");
	});
});

describe("getRootMetadata — stega", () => {
	it("strips stega characters from siteTitle and siteDescription before they reach metadata", async () => {
		getSiteSettings.mockResolvedValue({
			...emptySiteSettings(),
			siteTitle: `Stega${STEGA_MARKER}Title`,
			siteDescription: `Stega${STEGA_MARKER}Description`,
		});

		const metadata = await getRootMetadata();

		expect(metadata.title).toEqual({
			default: "StegaTitle",
			template: (defaultMetadata.title as { template: string }).template,
		});
		expect(metadata.description).toBe("StegaDescription");
	});

	it("strips stega characters from the OG image altText", async () => {
		getSiteSettings.mockResolvedValue({
			...emptySiteSettings(),
			ogImage: {
				asset: { _ref: OG_ASSET_REF, _type: "reference" },
				altText: `Alt${STEGA_MARKER}Text`,
			},
		});

		const metadata = await getRootMetadata();
		const [image] = metadata.openGraph?.images as Array<{ alt: string }>;

		expect(image.alt).toBe("AltText");
	});
});

describe("siteConfig — unchanged consumer contract", () => {
	// app/page.tsx, app/blog/[slug]/page.tsx, app/templates/[slug]/page.tsx and
	// app/[slug]/page.tsx all import `siteConfig`/`defaultMetadata` directly —
	// this unit must not change their shape or values.
	it("still exports the same site URL and name other pages rely on", () => {
		expect(siteConfig.name).toBe("Granite Marketing");
		expect(siteConfig.url).toBe("https://www.granitemarketing.co.uk");
	});
});
