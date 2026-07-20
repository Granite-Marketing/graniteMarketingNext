import { describe, expect, it } from "vitest";
import { ctaBlock } from "../ctaBlock";
import { resolveCta } from "../../../lib/resolve-cta";
import type { CtaBlockOverrides } from "../../../lib/resolve-cta";

describe("studio-schemas/blocks/ctaBlock", () => {
	it("is an object type titled Call to Action, carrying the icon at the type level", () => {
		expect(ctaBlock.name).toBe("ctaBlock");
		expect(ctaBlock.type).toBe("object");
		expect(ctaBlock.title).toBe("Call to Action");
		expect(ctaBlock.icon).toBeDefined();
	});

	it("exposes anchorId as a plain string, last in field order", () => {
		const fieldNames = ctaBlock.fields.map((field) => field.name);
		expect(fieldNames).toContain("anchorId");
		expect(fieldNames[fieldNames.length - 1]).toBe("anchorId");
		const anchorId = ctaBlock.fields.find((f) => f.name === "anchorId");
		expect(anchorId?.type).toBe("string");
	});

	it("has the full field set", () => {
		const fieldNames = ctaBlock.fields.map((field) => field.name);
		expect(fieldNames).toEqual([
			"ctaHeading",
			"ctaSubtitle",
			"ctaButton",
			"ctaFootnote",
			"secondaryCta",
			"anchorId",
		]);
	});

	it("ctaButton is a labelled link — {label, link} — matching siteSettings.ctaButton exactly", () => {
		const ctaButton = ctaBlock.fields.find((f) => f.name === "ctaButton");
		expect(ctaButton?.type).toBe("object");
		const fields = (
			ctaButton as unknown as { fields: Array<{ name: string; type: string }> }
		).fields;
		expect(fields.map((f) => f.name)).toEqual(["label", "link"]);
		expect(fields.find((f) => f.name === "link")?.type).toBe("link");
	});

	it("secondaryCta is also a labelled link, independent of ctaButton and of any siteSettings fallback", () => {
		const secondaryCta = ctaBlock.fields.find(
			(f) => f.name === "secondaryCta"
		);
		expect(secondaryCta?.type).toBe("object");
		const fields = (
			secondaryCta as unknown as { fields: Array<{ name: string; type: string }> }
		).fields;
		expect(fields.map((f) => f.name)).toEqual(["label", "link"]);
	});

	// "Every field is optional and falls back to siteSettings defaults" — the
	// concrete, checkable form of that requirement is that not one of the
	// four siteSettings-mirrored fields declares a top-level Rule.required().
	// (secondaryCta and anchorId are also unrequired — checked here too,
	// since nothing on this block should block publish.)
	it("every top-level field is optional — none declare Rule.required()", () => {
		for (const field of ctaBlock.fields) {
			expect(
				field.validation,
				`${field.name} must not be required`
			).toBeUndefined();
		}
	});

	it("does not import siteSettings or resolve-cta — no import statement references either", async () => {
		// The prose in ctaBlock.ts's header comment legitimately talks *about*
		// "Site Settings" and "resolve-cta" to explain the fallback behaviour
		// to editors and future maintainers — so this checks for an actual
		// `import ... from "..."` statement, not just the words appearing
		// anywhere in the file.
		const path = await import("node:path");
		const fs = await import("node:fs/promises");
		const source = await fs.readFile(
			path.join(process.cwd(), "lib/sanity/studio-schemas/blocks/ctaBlock.ts"),
			"utf8"
		);
		const importLines = source
			.split("\n")
			.filter((line) => line.trim().startsWith("import "));
		expect(
			importLines.some((line) => /siteSettings|resolve-cta/i.test(line))
		).toBe(false);
	});

	it("its four siteSettings-mirrored fields shape a valid CtaBlockOverrides — the type resolve-cta.ts (U9) already resolves against", () => {
		// Compile-time conformance: if ctaBlock's shape drifted from
		// CtaBlockOverrides, this object literal would fail to type-check.
		const overrides: CtaBlockOverrides = {
			ctaHeading: "Ready when you are.",
			ctaSubtitle: "Thirty minutes, no slides.",
			ctaButton: {
				label: "Book an intro call",
				link: { linkType: "external", href: "https://cal.com/granite/30min" },
			},
			ctaFootnote: "avg. response time: same day",
		};

		// Behavioural conformance: resolveCta accepts a ctaBlock-shaped value
		// (minus the fields resolve-cta.ts doesn't know about — secondaryCta,
		// anchorId) and resolves it correctly, end to end.
		const resolved = resolveCta(overrides, {});
		expect(resolved.heading).toBe("Ready when you are.");
		expect(resolved.button).toEqual({
			kind: "navigate",
			label: "Book an intro call",
			href: "https://cal.com/granite/30min",
		});
	});

	describe("prepare — subtitle is always the block type name", () => {
		it("falls back to the block name when ctaHeading is empty (siteSettings default applies)", () => {
			const result = ctaBlock.preview!.prepare!({ title: undefined });
			expect(result.subtitle).toBe("Call to Action");
			expect(result.title).toContain("Call to Action");
			expect(result.media).toBeDefined();
		});

		it("uses ctaHeading as the title when set", () => {
			const result = ctaBlock.preview!.prepare!({
				title: "Stop doing work a workflow could do.",
			});
			expect(result.title).toBe("Stop doing work a workflow could do.");
			expect(result.subtitle).toBe("Call to Action");
		});
	});
});
