import { describe, expect, it, vi } from "vitest";
import type { FieldDefinition, ValidationContext } from "sanity";
import { testimonialsBlock } from "../testimonialsBlock";

// Mirrors the stub-Rule approach in
// lib/sanity/studio-schemas/objects/__tests__/link.test.ts — `defineField`/
// `defineType` are identity functions at runtime, so `testimonialsBlock.fields`
// holds the exact `hidden`/`validation` callbacks written in the schema file.
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
	const field = testimonialsBlock.fields.find((f) => f.name === name);
	if (!field) throw new Error(`testimonialsBlock has no field named "${name}"`);
	return field as FieldDefinition;
}

describe("studio-schemas/blocks/testimonialsBlock", () => {
	it("is an object type carrying anchorId", () => {
		expect(testimonialsBlock.name).toBe("testimonialsBlock");
		expect(testimonialsBlock.type).toBe("object");
		const fieldNames = testimonialsBlock.fields.map((f) => f.name);
		expect(fieldNames).toContain("anchorId");
	});

	it("sourceMode defaults to auto", () => {
		const field = findField("sourceMode");
		expect((field as { initialValue?: unknown }).initialValue).toBe("auto");
	});

	it("manualTestimonials is hidden unless sourceMode is manual", () => {
		const field = findField("manualTestimonials");
		if (typeof field.hidden !== "function") {
			throw new Error("manualTestimonials.hidden is not a callback");
		}
		expect(
			field.hidden({
				parent: { sourceMode: "auto" },
				document: undefined,
				value: undefined,
				currentUser: null,
			})
		).toBe(true);
		expect(
			field.hidden({
				parent: { sourceMode: "manual" },
				document: undefined,
				value: undefined,
				currentUser: null,
			})
		).toBe(false);
	});

	it("manualTestimonials is required only while sourceMode is manual — switching back to auto does not block publish", () => {
		const field = findField("manualTestimonials");
		const stubRule = createStubRule();
		(field.validation as unknown as (rule: typeof stubRule) => unknown)(
			stubRule
		);
		const validate = stubRule.getCustomValidator();
		if (!validate) throw new Error("manualTestimonials did not call Rule.custom()");

		// Manual with nothing picked: blocked.
		expect(
			validate([], { parent: { sourceMode: "manual" } } as ValidationContext)
		).not.toBe(true);

		// Manual with at least one pick: passes.
		expect(
			validate([{ _ref: "client-1" }], {
				parent: { sourceMode: "manual" },
			} as ValidationContext)
		).toBe(true);

		// Switched back to auto while the array is still empty (or stale) —
		// the now-hidden field must not block publish.
		expect(
			validate([], { parent: { sourceMode: "auto" } } as ValidationContext)
		).toBe(true);
		expect(
			validate(undefined, {
				parent: { sourceMode: "auto" },
			} as ValidationContext)
		).toBe(true);
	});

	it("prepare() returns a non-empty subtitle naming the block type, regardless of content", () => {
		const prepare = testimonialsBlock.preview?.prepare;
		if (!prepare) throw new Error("testimonialsBlock has no preview.prepare");

		const withHeading = prepare({ title: "In their words, not ours.", sourceMode: "auto" });
		expect(withHeading.subtitle).toBeTruthy();
		expect(withHeading.title).toBe("In their words, not ours.");

		const withoutHeading = prepare({ title: undefined, sourceMode: "manual" });
		expect(withoutHeading.subtitle).toBeTruthy();
		expect(withoutHeading.title).toBeTruthy();
	});
});
