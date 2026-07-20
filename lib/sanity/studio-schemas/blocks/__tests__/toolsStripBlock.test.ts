import { describe, expect, it, vi } from "vitest";
import type { FieldDefinition, ValidationContext } from "sanity";
import { toolsStripBlock } from "../toolsStripBlock";

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
	const field = toolsStripBlock.fields.find((f) => f.name === name);
	if (!field) throw new Error(`toolsStripBlock has no field named "${name}"`);
	return field as FieldDefinition;
}

describe("studio-schemas/blocks/toolsStripBlock", () => {
	it("is an object type carrying anchorId", () => {
		expect(toolsStripBlock.name).toBe("toolsStripBlock");
		expect(toolsStripBlock.type).toBe("object");
		expect(toolsStripBlock.fields.map((f) => f.name)).toContain("anchorId");
	});

	it("sourceMode defaults to auto", () => {
		expect(
			(findField("sourceMode") as { initialValue?: unknown }).initialValue
		).toBe("auto");
	});

	it("manualTools is hidden unless sourceMode is manual", () => {
		const field = findField("manualTools");
		if (typeof field.hidden !== "function") {
			throw new Error("manualTools.hidden is not a callback");
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

	it("manualTools is required only while sourceMode is manual — switching back to auto does not block publish", () => {
		const field = findField("manualTools");
		const stubRule = createStubRule();
		(field.validation as unknown as (rule: typeof stubRule) => unknown)(
			stubRule
		);
		const validate = stubRule.getCustomValidator();
		if (!validate) throw new Error("manualTools did not call Rule.custom()");

		expect(
			validate([], { parent: { sourceMode: "manual" } } as ValidationContext)
		).not.toBe(true);
		expect(
			validate([{ _ref: "tool-1" }], {
				parent: { sourceMode: "manual" },
			} as ValidationContext)
		).toBe(true);
		expect(
			validate([], { parent: { sourceMode: "auto" } } as ValidationContext)
		).toBe(true);
	});

	it("prepare() returns a non-empty subtitle naming the block type, regardless of content", () => {
		const prepare = toolsStripBlock.preview?.prepare;
		if (!prepare) throw new Error("toolsStripBlock has no preview.prepare");

		expect(
			prepare({ title: "Built with industry-leading tools", sourceMode: "auto" })
				.subtitle
		).toBeTruthy();
		expect(prepare({ title: undefined, sourceMode: "manual" }).subtitle).toBeTruthy();
		expect(prepare({ title: undefined, sourceMode: "manual" }).title).toBeTruthy();
	});
});
