import { vercelStegaCombine } from "@vercel/stega";
import { describe, expect, it } from "vitest";
import { resolveLink, type LinkValue, type ResolvedLink } from "../resolve-link";
import { CAL_LINK } from "@/components/data";

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

		expect(resolveLink(link)).toEqual({ kind: "navigate", href: "/about-us" });
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

		expect(resolveLink(link)).toEqual({ kind: "navigate", href: "/privacy" });
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
		).toEqual({ kind: "navigate", href: "/blog/how-we-ship" });

		expect(
			resolveLink({
				linkType: "internal",
				internalRef: {
					_type: "workflowTemplate",
					slug: { current: "s3-presigned-url" },
				},
			})
		).toEqual({ kind: "navigate", href: "/templates/s3-presigned-url" });
	});

	// U21/U22 prep (2026-07-19) — the three fixed-route singletons an editor
	// can now target from `internalRef` (link.ts's `to` array). None of them
	// has a `slug` field: their route is fixed in code (routes.ts's
	// `LINKABLE_ROUTE_BY_TYPE`), not derived from content, so the projected
	// value's `slug` is null exactly like a dangling reference's would be —
	// proving that case does NOT fall through to `pathForInternalDoc`'s
	// generic `!slug` guard the way a `page`/`blogPost`/etc. reference would.
	it("internal -> blogListing/templateListing/contactPage resolve to their fixed route even though the projected value has no slug", () => {
		expect(
			resolveLink({
				linkType: "internal",
				internalRef: { _type: "blogListing", _id: "blogListing", slug: null },
			})
		).toEqual({ kind: "navigate", href: "/blog" });

		expect(
			resolveLink({
				linkType: "internal",
				internalRef: {
					_type: "templateListing",
					_id: "templateListing",
					slug: null,
				},
			})
		).toEqual({ kind: "navigate", href: "/templates" });

		expect(
			resolveLink({
				linkType: "internal",
				internalRef: { _type: "contactPage", _id: "contactPage", slug: null },
			})
		).toEqual({ kind: "navigate", href: "/contact" });
	});

	it("internal -> blogPostTemplate/templateDetail cannot resolve to an href — not a page a link can mean", () => {
		// The primary guard here is at compile time, not runtime:
		// `DereferencedDoc._type` is `InternalDocType`, which does not include
		// "blogPostTemplate" or "templateDetail" (they are excluded from
		// routes.ts's `LinkableFixedRouteType`, which `InternalDocType` folds
		// in). Writing `internalRef: { _type: "blogPostTemplate", ... }`
		// against the real `LinkValue` type below does not compile — proven by
		// the `@ts-expect-error` line, which fails `tsc --noEmit` if this
		// exclusion ever regresses.
		//
		// The runtime guard is the fallback for the one path that bypasses the
		// type system: a stale document reference written before this
		// restriction existed, or a hand-crafted query result. `as unknown as
		// LinkValue` simulates exactly that — a value that reaches the
		// resolver despite the schema no longer allowing an editor to create
		// it — and the resolver must still fail closed rather than produce a
		// broken href.
		const staleBlogPostTemplateLink: LinkValue = {
			linkType: "internal",
			internalRef: {
				// @ts-expect-error — "blogPostTemplate" is not a member of InternalDocType
				_type: "blogPostTemplate",
				_id: "blogPostTemplate",
				slug: null,
			},
		};
		expect(resolveLink(staleBlogPostTemplateLink)).toBeNull();

		const staleTemplateDetailLink = {
			linkType: "internal",
			internalRef: {
				_type: "templateDetail",
				_id: "templateDetail",
				slug: null,
			},
		} as unknown as LinkValue;
		expect(resolveLink(staleTemplateDetailLink)).toBeNull();
	});

	it("anchor resolves to /{pageSlug}#{anchorId} when the target page differs from the current page", () => {
		const link: LinkValue = {
			linkType: "anchor",
			anchorPage: { _type: "page", _id: "page-home", slug: { current: "home" } },
			anchorId: "services",
		};

		expect(resolveLink(link, { currentSlug: "about-us" })).toEqual({
			kind: "navigate",
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
			kind: "navigate",
			href: "#services",
		});

		// No page reference at all is the common case for a link authored
		// while editing the page it lives on — also collapses to a bare anchor.
		const linkWithNoPageRef: LinkValue = {
			linkType: "anchor",
			anchorId: "results",
		};
		expect(resolveLink(linkWithNoPageRef)).toEqual({
			kind: "navigate",
			href: "#results",
		});
	});

	it("external returns href verbatim, and sets target=_blank with rel=noopener noreferrer when openInNewTab", () => {
		const withoutNewTab: LinkValue = {
			linkType: "external",
			href: "https://n8n.io",
			openInNewTab: false,
		};
		expect(resolveLink(withoutNewTab)).toEqual({
			kind: "navigate",
			href: "https://n8n.io",
		});

		const withNewTab: LinkValue = {
			linkType: "external",
			href: "https://n8n.io",
			openInNewTab: true,
		};
		expect(resolveLink(withNewTab)).toEqual({
			kind: "navigate",
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
		expect(resolveLink(link)).toEqual({
			kind: "navigate",
			href: "https://n8n.io",
		});
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

	describe("calBooking", () => {
		it("resolves to the Cal variant, not an href", () => {
			const link: LinkValue = {
				linkType: "calBooking",
				calLink: "sanindo/intro-call",
			};

			const resolved = resolveLink(link);

			expect(resolved).toEqual({
				kind: "calBooking",
				calLink: "sanindo/intro-call",
			});
			// Explicitly prove the shape has no `href` at all — a calBooking
			// result is not "an href that happens to also carry a kind", it has
			// no navigation target whatsoever.
			expect(resolved).not.toHaveProperty("href");
		});

		it("with no explicit handle falls back to the default CAL_LINK", () => {
			expect(resolveLink({ linkType: "calBooking" })).toEqual({
				kind: "calBooking",
				calLink: CAL_LINK,
			});

			// An author-cleared empty string is "no explicit handle" too, not a
			// deliberate empty booking handle.
			expect(resolveLink({ linkType: "calBooking", calLink: "" })).toEqual({
				kind: "calBooking",
				calLink: CAL_LINK,
			});
		});

		it("a stega-encoded 'calBooking' linkType still resolves correctly (draft-mode regression guard)", () => {
			const encodedLinkType = vercelStegaCombine("calBooking", {
				origin: "sanity.io",
				href: "https://example.com/studio/desk/link",
				title: "linkType",
			});

			expect(encodedLinkType).not.toBe("calBooking");
			expect(encodedLinkType.startsWith("calBooking")).toBe(true);

			const link: LinkValue = {
				linkType: encodedLinkType,
				calLink: "sanindo/intro-call",
			};

			// Without stegaClean, `clean.linkType === "calBooking"` is false and
			// the switch falls through to `default: return null` — silently
			// breaking every Cal booking CTA in Draft Mode.
			expect(resolveLink(link)).toEqual({
				kind: "calBooking",
				calLink: "sanindo/intro-call",
			});
		});
	});

	it("a resolved calBooking cannot be rendered as a plain href by mistake — the type discrimination holds", () => {
		// Compile-time proof, not just a runtime assertion. `link` here is
		// typed as the genuine `ResolvedLink` union (not a literal TypeScript
		// could narrow away at the declaration), so reading `.href` without
		// first narrowing on `kind` is a type error — this function would fail
		// `tsc --noEmit` if the union ever regressed back to a single
		// `{ href: string }` shape with an optional Cal field bolted on.
		function hrefIfNavigable(link: ResolvedLink): string | null {
			// @ts-expect-error — `href` does not exist on the union until it is
			// narrowed to the "navigate" branch; this line must not compile.
			return link.href;
		}
		void hrefIfNavigable;

		// The runtime half: an actual resolved calBooking value has no `href`
		// property at all, so any call site that blindly forwards `.href` to
		// `<a href>`/`<Link href>` renders `href={undefined}`, not a silent
		// wrong URL — and the type error above is what stops that call site
		// from being written in the first place.
		const calBookingResult = resolveLink({
			linkType: "calBooking",
			calLink: "sanindo/intro-call",
		});

		expect(calBookingResult).not.toBeNull();
		expect(calBookingResult?.kind).toBe("calBooking");
		expect(calBookingResult).not.toHaveProperty("href");
	});
});
