import { describe, expect, it } from "vitest";
import { resolveCta } from "../resolve-cta";
import type { CtaBlockOverrides, SiteSettingsCtaDefaults } from "../resolve-cta";

// resolve-cta.ts is the fallback resolver for the Global CTA (U9 of the
// Sanity page builder plan). `ctaBlock` (U12) doesn't exist yet, so this
// exercises the resolver directly with plain objects standing in for the
// query results of the block and the siteSettings singleton — exactly the
// behaviour worth locking down, independent of the block schema.

const button = (label: string, href: string) => ({
	label,
	link: {
		linkType: "external" as const,
		href,
	},
});

const siteDefaults: SiteSettingsCtaDefaults = {
	ctaHeading: "Stop doing work a workflow could do.",
	ctaSubtitle: "Thirty minutes, no slides.",
	ctaButton: button("Book an intro call", "https://cal.com/granite/30min"),
	ctaFootnote: "avg. response time: same day",
};

describe("resolveCta", () => {
	it("a ctaBlock with no overrides falls back to the singleton's CTA copy entirely", () => {
		const resolved = resolveCta({}, siteDefaults);

		expect(resolved).toEqual({
			heading: siteDefaults.ctaHeading,
			subtitle: siteDefaults.ctaSubtitle,
			button: {
				label: "Book an intro call",
				href: "https://cal.com/granite/30min",
			},
			footnote: siteDefaults.ctaFootnote,
		});
	});

	it("an undefined ctaBlock (block dropped with no configuration at all) also falls back entirely", () => {
		const resolved = resolveCta(undefined, siteDefaults);
		expect(resolved.heading).toBe(siteDefaults.ctaHeading);
		expect(resolved.button?.label).toBe("Book an intro call");
	});

	it("overriding ONLY ctaHeading keeps the singleton's subtitle, button and footnote — the naive-implementation trap", () => {
		const block: CtaBlockOverrides = {
			ctaHeading: "Ready when you are.",
		};

		const resolved = resolveCta(block, siteDefaults);

		expect(resolved.heading).toBe("Ready when you are.");
		expect(resolved.subtitle).toBe(siteDefaults.ctaSubtitle);
		expect(resolved.footnote).toBe(siteDefaults.ctaFootnote);
		expect(resolved.button).toEqual({
			label: "Book an intro call",
			href: "https://cal.com/granite/30min",
		});
	});

	it("overriding ONLY ctaButton keeps the singleton's heading, subtitle and footnote", () => {
		const block: CtaBlockOverrides = {
			ctaButton: button("Talk to sales", "/contact"),
		};

		const resolved = resolveCta(block, siteDefaults);

		expect(resolved.button).toEqual({ label: "Talk to sales", href: "/contact" });
		expect(resolved.heading).toBe(siteDefaults.ctaHeading);
		expect(resolved.subtitle).toBe(siteDefaults.ctaSubtitle);
		expect(resolved.footnote).toBe(siteDefaults.ctaFootnote);
	});

	it("a fully-overriding ctaBlock uses none of the singleton's copy", () => {
		const block: CtaBlockOverrides = {
			ctaHeading: "Custom heading",
			ctaSubtitle: "Custom subtitle",
			ctaButton: button("Custom CTA", "/custom"),
			ctaFootnote: "Custom footnote",
		};

		expect(resolveCta(block, siteDefaults)).toEqual({
			heading: "Custom heading",
			subtitle: "Custom subtitle",
			button: { label: "Custom CTA", href: "/custom" },
			footnote: "Custom footnote",
		});
	});

	it("both block and siteSettings unset (or empty) renders an empty state — all null, no throw", () => {
		expect(() => resolveCta(undefined, undefined)).not.toThrow();
		expect(resolveCta(undefined, undefined)).toEqual({
			heading: null,
			subtitle: null,
			button: null,
			footnote: null,
		});
		expect(resolveCta({}, {})).toEqual({
			heading: null,
			subtitle: null,
			button: null,
			footnote: null,
		});
	});

	it("a button with a label but a dangling/unresolvable link renders no button at all, not a dead href", () => {
		const block: CtaBlockOverrides = {
			ctaButton: {
				label: "Book now",
				link: { linkType: "internal", internalRef: null },
			},
		};

		expect(resolveCta(block, {}).button).toBeNull();
	});

	it("a button with a resolvable link but no label renders no button — a button needs visible text", () => {
		const block: CtaBlockOverrides = {
			ctaButton: { link: { linkType: "external", href: "/somewhere" } },
		};

		expect(resolveCta(block, {}).button).toBeNull();
	});
});
