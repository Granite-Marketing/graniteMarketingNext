import { describe, expect, it, vi } from "vitest";
import type { FieldDefinition, ValidationContext } from "sanity";
import { faqBlock } from "../faqBlock";

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
	const field = faqBlock.fields.find((f) => f.name === name);
	if (!field) throw new Error(`faqBlock has no field named "${name}"`);
	return field as FieldDefinition;
}

describe("studio-schemas/blocks/faqBlock", () => {
	it("is an object type carrying anchorId", () => {
		expect(faqBlock.name).toBe("faqBlock");
		expect(faqBlock.type).toBe("object");
		expect(faqBlock.fields.map((f) => f.name)).toContain("anchorId");
	});

	it("sourceMode defaults to auto, autoCategory defaults to general — matching today's getFAQs(\"general\")", () => {
		expect(
			(findField("sourceMode") as { initialValue?: unknown }).initialValue
		).toBe("auto");
		expect(
			(findField("autoCategory") as { initialValue?: unknown }).initialValue
		).toBe("general");
	});

	it("autoCategory is hidden in manual mode; manualFaqs is hidden in auto mode", () => {
		const autoCategory = findField("autoCategory");
		const manualFaqs = findField("manualFaqs");
		if (typeof autoCategory.hidden !== "function" || typeof manualFaqs.hidden !== "function") {
			throw new Error("expected both fields to declare a hidden callback");
		}

		const ctx = (sourceMode: string) => ({
			parent: { sourceMode },
			document: undefined,
			value: undefined,
			currentUser: null,
		});

		expect(autoCategory.hidden(ctx("auto"))).toBe(false);
		expect(autoCategory.hidden(ctx("manual"))).toBe(true);
		expect(manualFaqs.hidden(ctx("auto"))).toBe(true);
		expect(manualFaqs.hidden(ctx("manual"))).toBe(false);
	});

	it("manualFaqs is required only while sourceMode is manual — switching back to auto does not block publish", () => {
		const field = findField("manualFaqs");
		const stubRule = createStubRule();
		(field.validation as unknown as (rule: typeof stubRule) => unknown)(
			stubRule
		);
		const validate = stubRule.getCustomValidator();
		if (!validate) throw new Error("manualFaqs did not call Rule.custom()");

		expect(
			validate([], { parent: { sourceMode: "manual" } } as ValidationContext)
		).not.toBe(true);
		expect(
			validate([{ _ref: "faq-1" }], {
				parent: { sourceMode: "manual" },
			} as ValidationContext)
		).toBe(true);
		expect(
			validate([], { parent: { sourceMode: "auto" } } as ValidationContext)
		).toBe(true);
	});

	it("prepare() returns a non-empty subtitle naming the block type, regardless of content", () => {
		const prepare = faqBlock.preview?.prepare;
		if (!prepare) throw new Error("faqBlock has no preview.prepare");

		expect(prepare({ title: "FAQs.", sourceMode: "auto" }).subtitle).toBeTruthy();
		expect(prepare({ title: undefined, sourceMode: "manual" }).subtitle).toBeTruthy();
		expect(prepare({ title: undefined, sourceMode: "manual" }).title).toBeTruthy();
	});
});
