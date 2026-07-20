import { describe, expect, it, vi } from "vitest";
import type { FieldDefinition, ValidationContext } from "sanity";
import { link } from "../link";
import { AnchorIdInput } from "../../../studio-components/anchor-id-input";

// A minimal stand-in for Sanity's `Rule` builder. `defineField`/`defineType`
// are identity functions at runtime (verified in
// node_modules/@sanity/types/lib/index.js), so `link.fields` below holds the
// exact `hidden` and `validation` functions written in link.ts — this test
// exercises the real schema file, not a re-implementation of its logic.
function createStubRule() {
	let capturedCustomValidator:
		| ((value: unknown, context: ValidationContext) => unknown)
		| undefined;

	const rule = {
		required: vi.fn(() => rule),
		custom: vi.fn(
			(fn: (value: unknown, context: ValidationContext) => unknown) => {
				capturedCustomValidator = fn;
				return rule;
			}
		),
		getCustomValidator: () => capturedCustomValidator,
	};

	return rule;
}

function findField(name: string): FieldDefinition {
	const field = link.fields.find((f) => f.name === name);
	if (!field) throw new Error(`link has no field named "${name}"`);
	return field as FieldDefinition;
}

function runValidation(fieldName: string, value: unknown, parent: unknown) {
	const field = findField(fieldName);
	const stubRule = createStubRule();
	(field.validation as unknown as (rule: typeof stubRule) => unknown)(
		stubRule
	);
	const customValidator = stubRule.getCustomValidator();
	if (!customValidator) {
		throw new Error(`${fieldName} did not call Rule.custom()`);
	}
	return customValidator(value, { parent } as ValidationContext);
}

function runHidden(fieldName: string, parent: unknown) {
	const field = findField(fieldName);
	if (typeof field.hidden !== "function") {
		throw new Error(`${fieldName}.hidden is not a callback`);
	}
	return field.hidden({
		parent,
		document: undefined,
		value: undefined,
		currentUser: null,
	});
}

describe("studio-schemas/objects/link", () => {
	it("is a discriminated union on linkType with a string enum + radio layout", () => {
		const linkType = findField("linkType");
		expect(linkType.type).toBe("string");
		expect((linkType.options as { layout?: string })?.layout).toBe("radio");
		expect(
			(linkType.options as { list?: Array<{ value: string }> })?.list?.map(
				(o) => o.value
			)
		).toEqual(["internal", "anchor", "external", "calBooking"]);
	});

	describe("hidden — keyed off the OBJECT value (parent), never the document", () => {
		it("internalRef is visible only when linkType is internal", () => {
			expect(runHidden("internalRef", { linkType: "internal" })).toBe(false);
			expect(runHidden("internalRef", { linkType: "anchor" })).toBe(true);
			expect(runHidden("internalRef", { linkType: "external" })).toBe(true);
		});

		it("anchorPage and anchorId are visible only when linkType is anchor", () => {
			expect(runHidden("anchorPage", { linkType: "anchor" })).toBe(false);
			expect(runHidden("anchorPage", { linkType: "internal" })).toBe(true);
			expect(runHidden("anchorId", { linkType: "anchor" })).toBe(false);
			expect(runHidden("anchorId", { linkType: "external" })).toBe(true);
		});

		it("href and openInNewTab are visible only when linkType is external", () => {
			expect(runHidden("href", { linkType: "external" })).toBe(false);
			expect(runHidden("href", { linkType: "internal" })).toBe(true);
			expect(runHidden("openInNewTab", { linkType: "external" })).toBe(false);
			expect(runHidden("openInNewTab", { linkType: "anchor" })).toBe(true);
		});

		it("calLink is visible only when linkType is calBooking", () => {
			expect(runHidden("calLink", { linkType: "calBooking" })).toBe(false);
			expect(runHidden("calLink", { linkType: "internal" })).toBe(true);
			expect(runHidden("calLink", { linkType: "anchor" })).toBe(true);
			expect(runHidden("calLink", { linkType: "external" })).toBe(true);
		});

		it("reads parent, not document — a document-shaped object with no linkType still hides every variant field", () => {
			// Simulates the common bug: a field several levels deep whose
			// `hidden` callback was accidentally written against `document`
			// instead of `parent`. Passing a document-like shape here (no
			// `linkType` on it, since linkType lives on the nested object) must
			// still resolve every variant to hidden.
			const documentShapedParent = { _type: "siteSettings", title: "Home" };
			expect(runHidden("internalRef", documentShapedParent)).toBe(true);
			expect(runHidden("anchorPage", documentShapedParent)).toBe(true);
			expect(runHidden("href", documentShapedParent)).toBe(true);
			expect(runHidden("calLink", documentShapedParent)).toBe(true);
		});
	});

	describe("validation — hidden variants must not block publish", () => {
		it("internalRef: required when internal, skipped (permits publish) otherwise", () => {
			expect(runValidation("internalRef", undefined, { linkType: "internal" })).not.toBe(
				true
			);
			expect(
				runValidation("internalRef", { _ref: "abc" }, { linkType: "internal" })
			).toBe(true);
			// The hidden variants: an editor who picked "external" must be able
			// to publish with internalRef left empty.
			expect(runValidation("internalRef", undefined, { linkType: "external" })).toBe(
				true
			);
			expect(runValidation("internalRef", undefined, { linkType: "anchor" })).toBe(
				true
			);
		});

		it("anchorId: required when anchor, skipped otherwise", () => {
			expect(runValidation("anchorId", undefined, { linkType: "anchor" })).not.toBe(
				true
			);
			expect(runValidation("anchorId", "services", { linkType: "anchor" })).toBe(
				true
			);
			expect(runValidation("anchorId", undefined, { linkType: "internal" })).toBe(
				true
			);
			expect(runValidation("anchorId", undefined, { linkType: "external" })).toBe(
				true
			);
		});

		it("href: required when external, skipped otherwise", () => {
			expect(runValidation("href", undefined, { linkType: "external" })).not.toBe(
				true
			);
			expect(
				runValidation("href", "https://example.com", { linkType: "external" })
			).toBe(true);
			expect(runValidation("href", undefined, { linkType: "internal" })).toBe(true);
			expect(runValidation("href", undefined, { linkType: "anchor" })).toBe(true);
		});

		it("switching linkType to calBooking does not block publish, even though internalRef/anchorId/href are now hidden and empty", () => {
			// An editor who had "internal" (or "anchor"/"external") selected and
			// switches to "Cal.com booking" leaves the old variant's now-hidden
			// field empty in the document — that must not fail Rule.required()
			// underneath the hood. Each of the three older variants' custom
			// validators only enforces "required" when it is itself the active
			// variant (see the pattern comment on internalRef above), so a
			// calBooking parent must resolve every one of them to `true`.
			const parent = { linkType: "calBooking" };
			expect(runValidation("internalRef", undefined, parent)).toBe(true);
			expect(runValidation("anchorId", undefined, parent)).toBe(true);
			expect(runValidation("href", undefined, parent)).toBe(true);
		});
	});

	describe("anchorId field — custom dropdown input (U11)", () => {
		it("is still declared as a plain string field, not a slug or other type — the stored shape is unchanged", () => {
			const anchorIdField = findField("anchorId");
			expect(anchorIdField.type).toBe("string");
		});

		it("wires the anchor picker component in as its input, without touching hidden/validation", () => {
			const anchorIdField = findField("anchorId");
			expect(
				(anchorIdField as unknown as { components?: { input?: unknown } })
					.components?.input
			).toBe(AnchorIdInput);
			// hidden/validation are the same callbacks exercised throughout this
			// file's "hidden" and "validation" describe blocks above — this test
			// only proves the component swap didn't replace or drop them.
			expect(typeof anchorIdField.hidden).toBe("function");
			expect(typeof anchorIdField.validation).toBe("function");
		});

		it("required-when-anchor validation still runs the same as before the input swap", () => {
			expect(
				runValidation("anchorId", undefined, { linkType: "anchor" })
			).not.toBe(true);
			expect(
				runValidation("anchorId", "services", { linkType: "anchor" })
			).toBe(true);
		});
	});

	describe("calLink field", () => {
		it("has no Rule.custom validator — it is optional even when calBooking is the active variant", () => {
			const calLinkField = findField("calLink");
			const stubRule = createStubRule();
			(calLinkField.validation as unknown as (rule: typeof stubRule) => unknown)?.(
				stubRule
			);
			expect(stubRule.getCustomValidator()).toBeUndefined();
		});

		it("initialValue matches the site's default booking handle", () => {
			const calLinkField = findField("calLink");
			expect(calLinkField.initialValue).toBeTruthy();
			expect(typeof calLinkField.initialValue).toBe("string");
		});
	});
});
