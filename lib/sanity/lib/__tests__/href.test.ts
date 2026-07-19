import { describe, expect, it } from "vitest";
import { isValidHref } from "../href";

// Moved here (from studio-schemas/objects/__tests__/href.test.ts, which still
// exists and still passes — link.ts re-exports `isValidHref` from this
// module so the Studio-side `Rule.custom` validation keeps working
// unchanged) so the accept/reject boundary is pinned against the module the
// runtime resolver actually imports, not just the Studio re-export.
//
// The bug this replaces: `href` was `type: "url"`, whose built-in URI check
// runs in addition to any custom validation and knows nothing about which
// link variant is active. An editor switching a link from External to
// Internal hit "Not a valid URL" pointing at a hidden field, holding a value
// they never typed — the seeded "/contact" — which the built-in check also
// rejected for being relative.
describe("isValidHref", () => {
	it("accepts site-relative paths", () => {
		expect(isValidHref("/contact")).toBe(true);
		expect(isValidHref("/blog/some-post")).toBe(true);
		expect(isValidHref("/blog?tag=automation")).toBe(true);
	});

	it("accepts absolute URLs on the allowed schemes", () => {
		expect(isValidHref("https://www.granitemarketing.co.uk")).toBe(true);
		expect(isValidHref("http://example.com/path")).toBe(true);
		expect(isValidHref("mailto:hello@granitemarketing.co.uk")).toBe(true);
		expect(isValidHref("tel:+441234567890")).toBe(true);
	});

	it("rejects protocol-relative URLs, which silently inherit the page scheme", () => {
		expect(isValidHref("//evil.example.com")).toBe(false);
	});

	it("rejects schemes that are not navigation", () => {
		expect(isValidHref("javascript:alert(1)")).toBe(false);
		expect(isValidHref("data:text/html,<script>alert(1)</script>")).toBe(false);
		expect(isValidHref("ftp://files.example.com")).toBe(false);
		expect(isValidHref("vbscript:msgbox(1)")).toBe(false);
	});

	it("rejects bare text that is neither a path nor a URL", () => {
		expect(isValidHref("contact")).toBe(false);
		expect(isValidHref("www.example.com")).toBe(false);
	});

	it("rejects empty and whitespace-only values", () => {
		expect(isValidHref("")).toBe(false);
		expect(isValidHref("   ")).toBe(false);
	});
});
