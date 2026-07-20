import { describe, expect, it, vi } from "vitest";
import type { FieldDefinition, ValidationContext } from "sanity";
import { resultsBlock } from "../resultsBlock";

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
	const field = resultsBlock.fields.find((f) => f.name === name);
	if (!field) throw new Error(`resultsBlock has no field named "${name}"`);
	return field as FieldDefinition;
}

describe("studio-schemas/blocks/resultsBlock", () => {
	it("is an object type carrying anchorId and a stats array", () => {
		expect(resultsBlock.name).toBe("resultsBlock");
		expect(resultsBlock.type).toBe("object");
		const fieldNames = resultsBlock.fields.map((f) => f.name);
		expect(fieldNames).toContain("anchorId");
		expect(fieldNames).toContain("stats");
	});

	it("sourceMode (case studies) defaults to auto", () => {
		expect(
			(findField("sourceMode") as { initialValue?: unknown }).initialValue
		).toBe("auto");
	});

	it("every stat field carries a description naming the real-numbers source, so the field is never editable undocumented", () => {
		const statsField = findField("stats") as unknown as {
			description?: string;
			of: Array<{ fields: FieldDefinition[] }>;
		};
		expect(statsField.description).toMatch(/n8n dashboard/i);
		expect(statsField.description).toMatch(/2026-07-02/);

		const valueField = statsField.of[0].fields.find((f) => f.name === "value");
		expect((valueField as unknown as { description?: string }).description).toMatch(
			/n8n dashboard/i
		);
	});

	it("manualCaseStudies is hidden unless sourceMode is manual", () => {
		const field = findField("manualCaseStudies");
		if (typeof field.hidden !== "function") {
			throw new Error("manualCaseStudies.hidden is not a callback");
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

	it("manualCaseStudies is required only while sourceMode is manual — switching back to auto does not block publish", () => {
		const field = findField("manualCaseStudies");
		const stubRule = createStubRule();
		(field.validation as unknown as (rule: typeof stubRule) => unknown)(
			stubRule
		);
		const validate = stubRule.getCustomValidator();
		if (!validate) throw new Error("manualCaseStudies did not call Rule.custom()");

		expect(
			validate([], { parent: { sourceMode: "manual" } } as ValidationContext)
		).not.toBe(true);
		expect(
			validate([{ _ref: "case-study-1" }], {
				parent: { sourceMode: "manual" },
			} as ValidationContext)
		).toBe(true);
		expect(
			validate([], { parent: { sourceMode: "auto" } } as ValidationContext)
		).toBe(true);
	});

	it("prepare() returns a non-empty subtitle naming the block type, regardless of content", () => {
		const prepare = resultsBlock.preview?.prepare;
		if (!prepare) throw new Error("resultsBlock has no preview.prepare");

		expect(
			prepare({ title: "Measured in hours back, not features shipped.", sourceMode: "auto" })
				.subtitle
		).toBeTruthy();
		expect(prepare({ title: undefined, sourceMode: "manual" }).subtitle).toBeTruthy();
		expect(prepare({ title: undefined, sourceMode: "manual" }).title).toBeTruthy();
	});
});
