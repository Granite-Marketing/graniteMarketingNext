import { describe, expect, it } from "vitest";
import {
	resolveNavLinks,
	resolveLogoLink,
	resolveFooterColumns,
} from "../resolve-site-settings";

// resolve-site-settings.ts turns the siteSettings singleton's raw fields
// (U9 of the Sanity page builder plan) into what nav/logo/footer rendering
// needs, ahead of the nav.tsx/footer.tsx components themselves (U15) —
// mirrors the same "test the resolver, independent of the not-yet-built
// component" approach the plan calls for on the CTA fallback.

describe("resolveNavLinks", () => {
	it("resolves links through the U7 resolveLink, in the array's own order", () => {
		const navLinks = [
			{ label: "services", link: { linkType: "anchor" as const, anchorId: "services" } },
			{ label: "templates", link: { linkType: "internal" as const, internalRef: { _type: "workflowTemplate" as const, slug: { current: "n8n-crm-cleanup" } } } },
			{ label: "granite", link: { linkType: "external" as const, href: "https://example.com" } },
		];

		const resolved = resolveNavLinks(navLinks);

		expect(resolved.map((l) => l.label)).toEqual([
			"services",
			"templates",
			"granite",
		]);
		// `l.href` only exists on the "navigate" branch of the ResolvedLink
		// union — narrowing here (rather than reading `.href` unconditionally)
		// is itself proof the discrimination is enforced at the type level for
		// every consumer, not just resolveLink's own return type.
		expect(resolved.map((l) => (l.kind === "navigate" ? l.href : null))).toEqual([
			"#services",
			"/templates/n8n-crm-cleanup",
			"https://example.com",
		]);
	});

	it("resolves a navLink set to calBooking to the Cal variant, not a plain href", () => {
		const navLinks = [
			{
				label: "book a call",
				link: { linkType: "calBooking" as const, calLink: "sanindo/intro-call" },
			},
		];

		const resolved = resolveNavLinks(navLinks);

		expect(resolved).toEqual([
			{ kind: "calBooking", label: "book a call", calLink: "sanindo/intro-call" },
		]);
	});

	it("an empty array resolves to an empty array without crashing", () => {
		expect(() => resolveNavLinks([])).not.toThrow();
		expect(resolveNavLinks([])).toEqual([]);
	});

	it("undefined navLinks resolves to an empty array without crashing", () => {
		expect(() => resolveNavLinks(undefined)).not.toThrow();
		expect(resolveNavLinks(undefined)).toEqual([]);
	});

	it("drops (rather than renders as a dead anchor) an item with a dangling reference, keeping the rest in order", () => {
		const navLinks = [
			{ label: "services", link: { linkType: "anchor" as const, anchorId: "services" } },
			{
				label: "broken",
				link: { linkType: "internal" as const, internalRef: null },
			},
			{ label: "results", link: { linkType: "anchor" as const, anchorId: "results" } },
		];

		const resolved = resolveNavLinks(navLinks);

		expect(resolved.map((l) => l.label)).toEqual(["services", "results"]);
	});

	it("drops an item with no label", () => {
		const navLinks = [
			{ label: "", link: { linkType: "anchor" as const, anchorId: "services" } },
			{ label: "results", link: { linkType: "anchor" as const, anchorId: "results" } },
		];

		expect(resolveNavLinks(navLinks).map((l) => l.label)).toEqual(["results"]);
	});
});

describe("resolveLogoLink", () => {
	it("an unset logoLink defaults to / rather than a dead anchor", () => {
		expect(resolveLogoLink(undefined)).toEqual({ kind: "navigate", href: "/" });
		expect(resolveLogoLink(null)).toEqual({ kind: "navigate", href: "/" });
	});

	it("a logoLink with an unresolvable target also falls back to /", () => {
		expect(
			resolveLogoLink({ linkType: "internal", internalRef: null })
		).toEqual({ kind: "navigate", href: "/" });
	});

	it("a resolvable logoLink resolves to its own target, not the / fallback", () => {
		expect(
			resolveLogoLink({ linkType: "external", href: "https://example.com" })
		).toEqual({ kind: "navigate", href: "https://example.com" });
	});
});

describe("resolveFooterColumns", () => {
	it("an empty footerColumns array renders no columns, without crashing", () => {
		expect(() => resolveFooterColumns([])).not.toThrow();
		expect(resolveFooterColumns([])).toEqual([]);
	});

	it("undefined footerColumns renders no columns, without crashing", () => {
		expect(() => resolveFooterColumns(undefined)).not.toThrow();
		expect(resolveFooterColumns(undefined)).toEqual([]);
	});

	it("resolves each column's heading and links, links resolved through resolveNavLinks", () => {
		const columns = [
			{
				heading: "Product",
				links: [
					{ label: "Templates", link: { linkType: "internal" as const, internalRef: { _type: "page" as const, slug: { current: "templates" } } } },
				],
			},
			{
				heading: "Company",
				links: [
					{ label: "Blog", link: { linkType: "internal" as const, internalRef: { _type: "blogPost" as const, slug: { current: "hello" } } } },
				],
			},
		];

		expect(resolveFooterColumns(columns)).toEqual([
			{
				heading: "Product",
				links: [{ kind: "navigate", label: "Templates", href: "/templates" }],
			},
			{
				heading: "Company",
				links: [{ kind: "navigate", label: "Blog", href: "/blog/hello" }],
			},
		]);
	});

	it("a column with a heading but zero resolvable links still renders, with an empty links array", () => {
		const columns = [
			{
				heading: "Legal",
				links: [{ label: "broken", link: { linkType: "internal" as const, internalRef: null } }],
			},
		];

		expect(resolveFooterColumns(columns)).toEqual([
			{ heading: "Legal", links: [] },
		]);
	});

	it("a column with no heading is dropped entirely", () => {
		const columns = [{ heading: "", links: [] }];
		expect(resolveFooterColumns(columns)).toEqual([]);
	});
});
