import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Contact } from "../contact";

// The regression this pins: /contact briefly rendered its heading and
// subtitle TWICE. contactPage was given hero fields by analogy with
// blogListing/templateListing, and app/contact/page.tsx rendered a
// ContentHero from them — but unlike those two routes, /contact never had a
// ContentHero to migrate. Its header has always lived inside THIS component,
// hardcoded, so the new one stacked on top of the existing one.
//
// The fix makes those fields override the header this component already
// owns. Which means this component is where "there is exactly one header"
// has to be proven.

afterEach(cleanup);

describe("Contact", () => {
	it("renders its own header copy by default", () => {
		render(<Contact />);

		expect(
			screen.getByRole("heading", { name: "Let's start a conversation." })
		).toBeDefined();
		expect(
			screen.getByText(/Reach out to discuss your automation needs/)
		).toBeDefined();
		expect(screen.getByText("// contact")).toBeDefined();
	});

	it("lets Sanity copy override each part of the header", () => {
		render(
			<Contact
				tag="get in touch"
				heading="Say hello."
				subtitle="We reply within a day."
			/>
		);

		expect(screen.getByRole("heading", { name: "Say hello." })).toBeDefined();
		expect(screen.getByText("We reply within a day.")).toBeDefined();
		expect(screen.getByText("// get in touch")).toBeDefined();
	});

	it("falls back per field, so a half-filled document never blanks the header", () => {
		render(<Contact heading="Say hello." />);

		expect(screen.getByRole("heading", { name: "Say hello." })).toBeDefined();
		// tag and subtitle were not supplied, so the originals stand rather
		// than rendering empty elements.
		expect(screen.getByText("// contact")).toBeDefined();
		expect(
			screen.getByText(/Reach out to discuss your automation needs/)
		).toBeDefined();
	});

	it("renders exactly one heading, whether or not copy is supplied", () => {
		// The duplication guard. A second header on this page is not a crash
		// or a type error — it just quietly renders the same words twice, so
		// only counting catches it.
		const { unmount } = render(<Contact />);
		expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
		unmount();

		render(<Contact heading="Say hello." />);
		expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
		expect(screen.queryByText("Let's start a conversation.")).toBeNull();
	});
});
