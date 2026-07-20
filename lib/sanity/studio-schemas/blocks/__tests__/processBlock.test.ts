import { describe, expect, it } from "vitest";
import { MAX_STEPS, MIN_STEPS, processBlock } from "../processBlock";

// Stub of Sanity's Rule chain, in the style of objects/__tests__/link.test.ts:
// `defineField` is an identity function at runtime, so `steps.validation`
// below holds the exact `Rule.min(...).max(...)` chain written in
// processBlock.ts — this captures the real declared thresholds rather than
// re-implementing them, then applies Sanity's documented array-length
// semantic (reject below min, reject above max) to assert the pass/fail
// behaviour the test scenarios call for.
function createStubRule() {
	let capturedMin: number | undefined;
	let capturedMax: number | undefined;

	const rule = {
		min: (value: number) => {
			capturedMin = value;
			return rule;
		},
		max: (value: number) => {
			capturedMax = value;
			return rule;
		},
		getBounds: () => ({ min: capturedMin, max: capturedMax }),
	};

	return rule;
}

function stepsField() {
	const field = processBlock.fields.find((f) => f.name === "steps");
	if (!field) throw new Error("processBlock has no steps field");
	return field;
}

function declaredBounds() {
	const field = stepsField();
	const stubRule = createStubRule();
	(field.validation as unknown as (rule: typeof stubRule) => unknown)(
		stubRule
	);
	return stubRule.getBounds();
}

function passesLength(length: number): boolean {
	const { min, max } = declaredBounds();
	if (min === undefined || max === undefined) {
		throw new Error("steps validation did not declare both min and max");
	}
	return length >= min && length <= max;
}

describe("studio-schemas/blocks/processBlock", () => {
	it("is an object type titled Process, carrying the icon at the type level", () => {
		expect(processBlock.name).toBe("processBlock");
		expect(processBlock.type).toBe("object");
		expect(processBlock.title).toBe("Process");
		expect(processBlock.icon).toBeDefined();
	});

	it("exposes anchorId as a plain string, last in field order", () => {
		const fieldNames = processBlock.fields.map((field) => field.name);
		expect(fieldNames).toContain("anchorId");
		expect(fieldNames[fieldNames.length - 1]).toBe("anchorId");
		const anchorId = processBlock.fields.find((f) => f.name === "anchorId");
		expect(anchorId?.type).toBe("string");
	});

	it("has the full transcribed field set", () => {
		const fieldNames = processBlock.fields.map((field) => field.name);
		expect(fieldNames).toEqual([
			"eyebrow",
			"heading",
			"body",
			"steps",
			"footnote",
			"anchorId",
		]);
	});

	it("steps is an array of processStep objects with stepLabel/title/description/duration", () => {
		const items = stepsField();
		expect(items.type).toBe("array");
		const member = (
			items as unknown as {
				of: Array<{ name: string; fields: Array<{ name: string }> }>;
			}
		).of[0];
		expect(member.name).toBe("processStep");
		expect(member.fields.map((f) => f.name)).toEqual([
			"stepLabel",
			"title",
			"description",
			"duration",
		]);
	});

	describe("prepare — subtitle is always the block type name", () => {
		it("falls back to the block name when heading is empty", () => {
			const result = processBlock.preview!.prepare!({ title: undefined });
			expect(result.subtitle).toBe("Process");
			expect(result.title).toBe("Process");
			expect(result.media).toBeDefined();
		});

		it("uses the heading as the title when set", () => {
			const result = processBlock.preview!.prepare!({
				title: "From first call to running in production.",
			});
			expect(result.title).toBe(
				"From first call to running in production."
			);
			expect(result.subtitle).toBe("Process");
		});
	});
});

describe("studio-schemas/blocks/processBlock — steps count guard (C4)", () => {
	it("declares min 2 / max 4, matching the exported constants", () => {
		expect(declaredBounds()).toEqual({ min: MIN_STEPS, max: MAX_STEPS });
	});

	it("1 step fails validation", () => {
		expect(passesLength(1)).toBe(false);
	});

	it("2 steps pass", () => {
		expect(passesLength(2)).toBe(true);
	});

	it("4 steps pass", () => {
		expect(passesLength(4)).toBe(true);
	});

	it("5 steps fails validation", () => {
		expect(passesLength(5)).toBe(false);
	});
});
