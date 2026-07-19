import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { routeField } from "../route-field";
import { ROUTE_BY_TYPE } from "../../routes";

// PART 1 of the fixed-route-visibility unit (2026-07-19). Two things need
// proving with real behaviour, not schema introspection alone:
//
// - the swapped-in input renders the route text, so it's actually visible
//   in the form, not just present in a `description` tooltip;
// - there is NOTHING editable in what it renders — no <input>, <textarea>
//   or <select> — which is what makes the field genuinely uneditable rather
//   than merely flagged read-only. `readOnly: true` is checked too, as
//   defence in depth, but the real guarantee is that nothing in the
//   rendered output could ever call `onChange`.
type RouteFieldShape = {
	readOnly?: boolean;
	components?: { input?: ComponentType<Record<string, never>> };
};

describe("studio-components/route-field", () => {
	it.each(Object.keys(ROUTE_BY_TYPE) as Array<keyof typeof ROUTE_BY_TYPE>)(
		"%s renders its route as plain read-only text, with no editable control",
		(type) => {
			const field = routeField(type) as unknown as RouteFieldShape;
			const RouteInput = field.components?.input;
			expect(RouteInput).toBeTypeOf("function");
			const Input = RouteInput!;

			const { container } = render(<Input />);

			expect(screen.getByText(ROUTE_BY_TYPE[type])).toBeInTheDocument();
			expect(container.querySelector("input, textarea, select")).toBeNull();
		}
	);

	it("is flagged read-only, as defence in depth on top of the uneditable input", () => {
		const field = routeField("blogListing") as unknown as RouteFieldShape;
		expect(field.readOnly).toBe(true);
	});

	it("names the field 'route' and titles it 'Route'", () => {
		const field = routeField("contactPage") as unknown as {
			name: string;
			title?: string;
		};
		expect(field.name).toBe("route");
		expect(field.title).toBe("Route");
	});
});
