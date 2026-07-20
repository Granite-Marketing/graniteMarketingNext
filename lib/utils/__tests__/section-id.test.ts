import { describe, expect, it } from "vitest";
import { sectionIdProps } from "../section-id";

// The three states are not interchangeable, and conflating them caused three
// separate HTML regressions the baseline harness caught: an explicitly-passed
// undefined id serialises into the RSC payload as "id":"$undefined", where
// the original markup had no id attribute at all.
describe("sectionIdProps", () => {
	it("uses the fallback when the prop was never passed", () => {
		expect(sectionIdProps(undefined, "services")).toEqual({ id: "services" });
	});

	it("omits the attribute entirely when explicitly anchor-less", () => {
		expect(sectionIdProps(null, "services")).toEqual({});
	});

	it("uses an explicit id over the fallback", () => {
		expect(sectionIdProps("pricing", "services")).toEqual({ id: "pricing" });
	});

	it("omits the attribute when there is no id and no fallback", () => {
		expect(sectionIdProps(undefined)).toEqual({});
		expect(sectionIdProps(null)).toEqual({});
	});

	it("treats an empty string as anchor-less rather than emitting id=''", () => {
		expect(sectionIdProps("", "services")).toEqual({});
	});

	// The distinction that matters for spreading: a key present with an
	// undefined value still reaches React as an explicit prop, so the returned
	// object must not carry the key at all.
	it("returns an object with no id key, not an undefined id value", () => {
		expect("id" in sectionIdProps(null)).toBe(false);
	});
});
