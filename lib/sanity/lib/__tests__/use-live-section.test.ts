import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useLiveSection } from "../use-live-section";

// `usePresentationQuery` (next-sanity) reads a module-level comlink
// snapshot rather than a React Context Provider (verified by reading
// next-sanity's source), so it safely resolves to inactive — `data: null`
// — in a plain test render with no Presentation Tool connection. That is
// exactly the path these tests exercise: outside Presentation, every block
// adapter must render the server-fetched initial value it was given, not
// crash or show a blank block.

describe("useLiveSection", () => {
	it("falls back to the initial value when not running inside Presentation", () => {
		const initial = { heading: "From the server" };
		const { result } = renderHook(() =>
			useLiveSection(
				"*[_id == $id][0].sections[_key == $key][0]{heading}",
				{ id: "page-1", key: "abc123" },
				initial
			)
		);

		expect(result.current).toBe(initial);
	});

	it("works with primitive initial values too", () => {
		const { result } = renderHook(() =>
			useLiveSection("*[0]", { id: "page-1", key: "abc123" }, "fallback")
		);

		expect(result.current).toBe("fallback");
	});
});
