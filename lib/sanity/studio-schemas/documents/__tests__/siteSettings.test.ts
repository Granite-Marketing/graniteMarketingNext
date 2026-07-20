import { describe, expect, it } from "vitest";
import type {
	FieldDefinition,
	ObjectDefinition,
	ArrayDefinition,
	ReferenceDefinition,
} from "sanity";
import {
	siteSettings,
	SITE_SETTINGS_TYPE,
	SITE_SETTINGS_ID,
	SITE_SETTINGS_QUERY,
} from "../siteSettings";

// siteSettings.ts is the site-wide chrome singleton (U9 of the Sanity page
// builder plan). The singleton PIN itself lives in lib/sanity/structure.ts
// and sanity.config.ts (see their test files) — this file only proves the
// schema shape: every field from the plan's Fields table is present, the
// named `link` type (U7) is reused rather than re-invented, and the Global
// CTA defaults carry the "fallback, not fixed value" description editors
// need to see.

function findField(name: string): FieldDefinition {
	const field = siteSettings.fields.find((f) => f.name === name);
	if (!field) throw new Error(`siteSettings has no field named "${name}"`);
	return field as FieldDefinition;
}

describe("studio-schemas/documents/siteSettings", () => {
	it("is a document type named siteSettings, matching the pinned id constants", () => {
		expect(siteSettings.name).toBe("siteSettings");
		expect(siteSettings.type).toBe("document");
		expect(SITE_SETTINGS_TYPE).toBe("siteSettings");
		expect(SITE_SETTINGS_ID).toBe("siteSettings");
	});

	it("preview always shows a fixed 'Site Settings' title, regardless of field content", () => {
		const prepare = siteSettings.preview?.prepare as
			| (() => { title: string })
			| undefined;
		expect(prepare).toBeTypeOf("function");
		expect(prepare?.()).toEqual({ title: "Site Settings" });
	});

	it("has every field from the plan's Fields table, grouped Brand / Navigation / Footer / Global CTA defaults / SEO & Social", () => {
		const fieldNames = siteSettings.fields.map((field) => field.name);
		expect(fieldNames).toEqual([
			"logo",
			"logoLink",
			"homePage",
			"navLinks",
			"headerCta",
			"footerColumns",
			"ctaHeading",
			"ctaSubtitle",
			"ctaButton",
			"ctaFootnote",
			"siteTitle",
			"siteDescription",
			"ogImage",
			"favicon",
		]);
	});

	describe("R7 — the Wise compliance strip is deliberately absent", () => {
		it.each([
			"copyright",
			"copyrightLine",
			"cardLogos",
			"policyLinks",
			"complianceLinks",
			"complianceStrip",
		])("does not define a %s field", (name) => {
			expect(
				siteSettings.fields.some((field) => field.name === name)
			).toBe(false);
		});
	});

	describe("Brand", () => {
		it("logo is an image with a real (non-derived) altText subfield", () => {
			const logo = findField("logo") as unknown as {
				type: string;
				fields?: FieldDefinition[];
			};
			expect(logo.type).toBe("image");
			const altText = logo.fields?.find((f) => f.name === "altText");
			expect(altText).toBeDefined();
			expect(altText?.type).toBe("string");
		});

		it("logoLink reuses the named link type from U7", () => {
			expect(findField("logoLink").type).toBe("link");
		});

		it("logoLink's description documents the / fallback so it isn't mistaken for a required field", () => {
			expect(findField("logoLink").description).toMatch(/\//);
			expect(findField("logoLink").description).toMatch(/homepage|fall/i);
		});

		describe("homePage — U16's homepage selection mechanism", () => {
			it("is a reference to page, not a boolean on page itself", () => {
				const homePage = findField("homePage") as unknown as ReferenceDefinition;
				expect(homePage.type).toBe("reference");
				expect(homePage.to).toEqual([{ type: "page" }]);
			});

			it("is a strong reference — Sanity blocks deleting the referenced page while this points at it", () => {
				const homePage = findField("homePage") as unknown as ReferenceDefinition;
				expect(homePage.weak).not.toBe(true);
			});

			it("is grouped with Brand, alongside logo/logoLink", () => {
				expect(findField("homePage").group).toBe("brand");
			});

			it("describes that it controls what renders at /", () => {
				expect(findField("homePage").description).toMatch(/\//);
				expect(findField("homePage").description).toMatch(/renders|homepage/i);
			});
		});
	});

	describe("Navigation", () => {
		it("navLinks is an array of labeled links (label + the named link type), not a bare array of link", () => {
			const navLinks = findField("navLinks") as unknown as ArrayDefinition;
			expect(navLinks.type).toBe("array");
			expect(navLinks.of).toHaveLength(1);
			const member = navLinks.of[0] as unknown as {
				type: string;
				fields: FieldDefinition[];
			};
			expect(member.type).toBe("object");
			expect(member.fields.map((f) => f.name)).toEqual(["label", "link"]);
			expect(member.fields.find((f) => f.name === "link")?.type).toBe(
				"link"
			);
		});

		it("headerCta is a single labeled link (label + link), not an array", () => {
			const headerCta = findField("headerCta") as unknown as ObjectDefinition;
			expect(headerCta.type).toBe("object");
			expect(headerCta.fields.map((f) => f.name)).toEqual(["label", "link"]);
			expect(headerCta.fields.find((f) => f.name === "link")?.type).toBe(
				"link"
			);
		});
	});

	describe("Footer", () => {
		it("footerColumns is an array of { heading, links[] }, links[] items are labeled links", () => {
			const footerColumns = findField(
				"footerColumns"
			) as unknown as ArrayDefinition;
			expect(footerColumns.type).toBe("array");
			const column = footerColumns.of[0] as unknown as {
				type: string;
				fields: FieldDefinition[];
			};
			expect(column.type).toBe("object");
			expect(column.fields.map((f) => f.name)).toEqual(["heading", "links"]);

			const links = column.fields.find(
				(f) => f.name === "links"
			) as unknown as ArrayDefinition;
			expect(links.type).toBe("array");
			const linkMember = links.of[0] as unknown as {
				type: string;
				fields: FieldDefinition[];
			};
			expect(linkMember.type).toBe("object");
			expect(linkMember.fields.map((f) => f.name)).toEqual(["label", "link"]);
			expect(linkMember.fields.find((f) => f.name === "link")?.type).toBe(
				"link"
			);
		});
	});

	describe("Global CTA defaults — fallback, not a fixed value", () => {
		it.each(["ctaHeading", "ctaSubtitle", "ctaButton", "ctaFootnote"])(
			"%s documents that it is a default a ctaBlock can override",
			(name) => {
				const description = findField(name).description;
				expect(description).toBeTruthy();
				expect(description).toMatch(/does not override/);
			}
		);

		it("ctaButton is a labeled link (label + the named link type), same shape as headerCta", () => {
			const ctaButton = findField("ctaButton") as unknown as ObjectDefinition;
			expect(ctaButton.type).toBe("object");
			expect(ctaButton.fields.map((f) => f.name)).toEqual(["label", "link"]);
			expect(ctaButton.fields.find((f) => f.name === "link")?.type).toBe(
				"link"
			);
		});

		it("ctaSubtitle is a multi-line text field, not a single-line string", () => {
			expect(findField("ctaSubtitle").type).toBe("text");
		});
	});

	describe("SEO & Social — site-wide SEO defaults", () => {
		it("siteTitle is an unvalidated string", () => {
			const siteTitle = findField("siteTitle");
			expect(siteTitle.type).toBe("string");
			expect(siteTitle.group).toBe("seo");
			expect(siteTitle.validation).toBeUndefined();
		});

		it("siteDescription is an unvalidated 3-row text field", () => {
			const siteDescription = findField("siteDescription");
			expect(siteDescription.type).toBe("text");
			expect((siteDescription as { rows?: number }).rows).toBe(3);
			expect(siteDescription.group).toBe("seo");
			expect(siteDescription.validation).toBeUndefined();
		});

		it("ogImage is an unvalidated image carrying its own altText field", () => {
			const ogImage = findField("ogImage") as unknown as {
				type: string;
				group?: string;
				validation?: unknown;
				fields?: FieldDefinition[];
			};
			expect(ogImage.type).toBe("image");
			expect(ogImage.group).toBe("seo");
			expect(ogImage.validation).toBeUndefined();
			const altText = ogImage.fields?.find((f) => f.name === "altText");
			expect(altText).toBeDefined();
			expect(altText?.type).toBe("string");
			expect(altText?.validation).toBeUndefined();
		});

		it("ogImage's description notes the 1200x630 convention and the no-image-of-its-own fallback", () => {
			const description = findField("ogImage").description;
			expect(description).toMatch(/1200/);
			expect(description).toMatch(/630/);
			expect(description).toMatch(/no image|does not have|own/i);
		});

		it("favicon is an unvalidated square image", () => {
			const favicon = findField("favicon");
			expect(favicon.type).toBe("image");
			expect(favicon.group).toBe("seo");
			expect(favicon.validation).toBeUndefined();
		});

		it("favicon's description expects a square PNG of at least 180px and explains the derived icon set", () => {
			const description = findField("favicon").description;
			expect(description).toMatch(/square/i);
			expect(description).toMatch(/180/);
			expect(description).toMatch(/tab|bookmark|home.?screen/i);
		});

		it.each(["siteTitle", "siteDescription", "ogImage", "favicon"])(
			"%s carries no required() validation — this singleton must stay publishable empty",
			(name) => {
				expect(findField(name).validation).toBeUndefined();
			}
		);
	});

	describe("SITE_SETTINGS_QUERY — the singleton query", () => {
		it("filters by _id, matching the pinned constant — not by _type", () => {
			expect(SITE_SETTINGS_QUERY).toContain(`_id == "${SITE_SETTINGS_ID}"`);
			expect(SITE_SETTINGS_QUERY).not.toMatch(/_type\s*==\s*"siteSettings"/);
		});

		it("takes the first (and only) match", () => {
			expect(SITE_SETTINGS_QUERY).toMatch(/\]\[0\]/);
		});

		it("projects every field from the plan's Fields table", () => {
			for (const field of [
				"logo",
				"logoLink",
				"navLinks",
				"headerCta",
				"footerColumns",
				"ctaHeading",
				"ctaSubtitle",
				"ctaButton",
				"ctaFootnote",
				"siteTitle",
				"siteDescription",
				"ogImage",
				"favicon",
			]) {
				expect(SITE_SETTINGS_QUERY).toContain(field);
			}
		});

		it("dereferences internalRef and anchorPage on every link so resolveLink can tell document types apart", () => {
			const derefCount = (SITE_SETTINGS_QUERY.match(/internalRef->/g) ?? [])
				.length;
			const anchorDerefCount = (
				SITE_SETTINGS_QUERY.match(/anchorPage->/g) ?? []
			).length;
			// One link per: logoLink, navLinks[], headerCta, footerColumns[].links[], ctaButton.
			expect(derefCount).toBeGreaterThanOrEqual(5);
			expect(anchorDerefCount).toBeGreaterThanOrEqual(5);
		});

		it("projects ogImage with asset/altText/hotspot/crop, matching logo's shape", () => {
			expect(SITE_SETTINGS_QUERY).toMatch(
				/ogImage\{\s*asset,\s*altText,\s*hotspot,\s*crop\s*\}/
			);
		});

		it("projects favicon with asset/hotspot/crop — it has no altText subfield to project", () => {
			expect(SITE_SETTINGS_QUERY).toMatch(
				/favicon\{\s*asset,\s*hotspot,\s*crop\s*\}/
			);
		});
	});

	it("every field is assigned to one of the five documented groups", () => {
		const groupNames = (siteSettings.groups ?? []).map((g) => g.name);
		expect(groupNames).toEqual([
			"brand",
			"navigation",
			"footer",
			"cta",
			"seo",
		]);

		for (const field of siteSettings.fields) {
			expect(
				groupNames,
				`field "${field.name}" has group "${(field as FieldDefinition).group}"`
			).toContain((field as FieldDefinition).group);
		}
	});
});
