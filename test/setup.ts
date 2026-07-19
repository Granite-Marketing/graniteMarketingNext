import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// vitest.config.ts does not set `test.globals: true`, so RTL's own
// auto-cleanup registration (which relies on a global `afterEach`) never
// fires. Without this, any test file with more than one `it()` block that
// calls `render()` leaks DOM nodes across tests — `screen.getByText(...)`
// starts matching leftover elements from a previous test's render and
// throws "multiple elements found" for text that legitimately appears
// once per render.
afterEach(() => {
	cleanup();
});
