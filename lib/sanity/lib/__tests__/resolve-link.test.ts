import { vercelStegaCombine } from "@vercel/stega";
import { describe, expect, it } from "vitest";
import { resolveLink, type LinkValue } from "../resolve-link";

describe("resolveLink", () => {
	it("internal resolves to /{slug} from the referenced doc", () => {
		const link: LinkValue = {
			linkType: "internal",
			internalRef: {
				_type: "page",
				_id: "page-about",
				slug: { current: "about-us" },
			},
		};

		expect(resolveLink(link)).toEqual({ href: "/about-us" });
	});

	it("internal -> legalPage resolves to the policy path, not /{slug}-as-a-generic-page", () => {
		// Both `page` and `legalPage` render at a flat root path today, but
		// they are handled by distinct `case`s in resolve-link.ts's internal
		// switch (not a shared fallthrough). This proves legalPage resolves
		// on its own path rather than silently missing the switch and
		// falling through to the `default: return null` branch — the failure
		// mode that would actually break every policy link.
		const link: LinkValue = {
			linkType: "internal",
			internalRef: {
				_type: "legalPage",
				_id: "legalPage-privacy",
				slug: { current: "privacy" },
			},
		};

		expect(resolveLink(link)).toEqual({ href: "/privacy" });
	});

	it("internal -> blogPost and workflowTemplate get their own route prefixes, proving the switch is type-aware", () => {
		expect(
			resolveLink({
				linkType: "internal",
				internalRef: {
					_type: "blogPost",
					slug: { current: "how-we-ship" },
				},
			})
		).toEqual({ href: "/blog/how-we-ship" });

		expect(
			resolveLink({
				linkType: "internal",
				internalRef: {
					_type: "workflowTemplate",
					slug: { current: "s3-presigned-url" },
				},
			})
		).toEqual({ href: "/templates/s3-presigned-url" });
	});

	it("anchor resolves to /{pageSlug}#{anchorId} when the target page differs from the current page", () => {
		const link: LinkValue = {
			linkType: "anchor",
			anchorPage: { _type: "page", _id: "page-home", slug: { current: "home" } },
			anchorId: "services",
		};

		expect(resolveLink(link, { currentSlug: "about-us" })).toEqual({
			href: "/home#services",
		});
	});

	it("anchor on the current page resolves to a bare #{anchorId}", () => {
		const linkToCurrentPage: LinkValue = {
			linkType: "anchor",
			anchorPage: { _type: "page", _id: "page-home", slug: { current: "home" } },
			anchorId: "services",
		};
		expect(resolveLink(linkToCurrentPage, { currentSlug: "home" })).toEqual({
			href: "#services",
		});

		// No page reference at all is the common case for a link authored
		// while editing the page it lives on — also collapses to a bare anchor.
		const linkWithNoPageRef: LinkValue = {
			linkType: "anchor",
			anchorId: "results",
		};
		expect(resolveLink(linkWithNoPageRef)).toEqual({ href: "#results" });
	});

	it("external returns href verbatim, and sets target=_blank with rel=noopener noreferrer when openInNewTab", () => {
		const withoutNewTab: LinkValue = {
			linkType: "external",
			href: "https://n8n.io",
			openInNewTab: false,
		};
		expect(resolveLink(withoutNewTab)).toEqual({ href: "https://n8n.io" });

		const withNewTab: LinkValue = {
			linkType: "external",
			href: "https://n8n.io",
			openInNewTab: true,
		};
		expect(resolveLink(withNewTab)).toEqual({
			href: "https://n8n.io",
			target: "_blank",
			rel: "noopener noreferrer",
		});
	});

	it("a stega-encoded linkType still resolves correctly (KTD4 regression guard)", () => {
		// A genuine stega fixture, not a plain string standing in for one: run
		// through @vercel/stega's own encoder (the same package
		// @sanity/client/stega's cleaner strips) so the invisible payload is
		// real, not asserted by hand.
		const encodedLinkType = vercelStegaCombine("external", {
			origin: "sanity.io",
			href: "https://example.com/studio/desk/link",
			title: "linkType",
		});

		// Prove the fixture is genuinely encoded before it does any work in
		// the assertion below — otherwise this test could pass for the wrong
		// reason (a plain string that never needed cleaning).
		expect(encodedLinkType).not.toBe("external");
		expect(encodedLinkType.startsWith("external")).toBe(true);

		const link: LinkValue = {
			linkType: encodedLinkType,
			href: "https://n8n.io",
			openInNewTab: false,
		};

		// Without stegaClean, `clean.linkType === "external"` is false and the
		// switch falls through to `default: return null` — silently breaking
		// every link in Draft Mode. This must resolve exactly as the
		// plain-string case above.
		expect(resolveLink(link)).toEqual({ href: "https://n8n.io" });
	});

	it("a dangling reference returns null rather than throwing", () => {
		const linkWithNullDereference: LinkValue = {
			linkType: "internal",
			internalRef: null,
		};
		expect(resolveLink(linkWithNullDereference)).toBeNull();

		const linkWithMissingDereference: LinkValue = {
			linkType: "internal",
		};
		expect(resolveLink(linkWithMissingDereference)).toBeNull();

		const linkWithNoSlug: LinkValue = {
			linkType: "internal",
			internalRef: { _type: "page", _id: "page-x", slug: null },
		};
		expect(resolveLink(linkWithNoSlug)).toBeNull();
	});

	it("an unknown linkType returns null rather than throwing", () => {
		expect(resolveLink({ linkType: "carrier-pigeon" })).toBeNull();
		expect(resolveLink({ linkType: undefined })).toBeNull();
		expect(resolveLink(null)).toBeNull();
		expect(resolveLink(undefined)).toBeNull();
	});
});
