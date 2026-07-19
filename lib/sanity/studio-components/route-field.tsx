import { defineField } from "sanity";
import type { FieldDefinition, StringInputProps } from "sanity";
import type { ComponentType } from "react";
import { ROUTE_BY_TYPE, type FixedRouteType } from "../routes";

// Studio components are ordinary client-side React — this file runs inside
// Sanity Studio's own bundled React app (a separate application from this
// repo's Next.js frontend), which is why it lives in its own
// `studio-components/` directory rather than alongside the schema files in
// `studio-schemas/`.
//
// PART 1 of the fixed-route-visibility unit (2026-07-19). `routeField()`
// below returns an ordinary string field — its title ("Route") and
// description render exactly as any other field's would, so the route
// reads as a normal part of the form rather than a tooltip-only aside —
// but overrides ONLY its `input` via `components.input`. The swapped-in
// input, `RouteDisplay`, is what makes the field genuinely uneditable
// rather than merely `readOnly`-flagged: it never renders an editable
// control (no <input>, no <textarea>, no onChange wiring of any kind), so
// there is nothing in the rendered output that COULD write a value, even if
// `readOnly` were somehow bypassed elsewhere. `readOnly: true` is set below
// too, as defence in depth (it also strips the "reset to default" action
// from the field's kebab menu), but it is not what does the real work.
//
// Because `RouteDisplay` never calls `onChange`, the field's value stays
// `undefined` for the life of the document — "route" never appears as a
// key in the stored document. That is what satisfies the hard constraint
// this unit is built around: nothing here is a second copy of routing
// data, only a read-only label describing it.
function createRouteDisplay(route: string): ComponentType<StringInputProps> {
	return function RouteDisplay() {
		return (
			<div
				style={{
					padding: "0.75em 1em",
					border: "1px solid var(--card-border-color, #d4d4d4)",
					borderRadius: 4,
					fontSize: "0.8125em",
					lineHeight: 1.4,
				}}
			>
				<code>{route}</code>
			</div>
		);
	};
}

/**
 * One `defineField()` per fixed-route singleton, named "route". Each of the
 * five page-type singleton schemas (blogListing, blogPostTemplate,
 * templateListing, templateDetail, contactPage) puts this FIRST in its
 * `fields` array — the first thing an editor sees when opening the form,
 * not a fact buried in a description tooltip.
 */
export function routeField(type: FixedRouteType): FieldDefinition {
	const route = ROUTE_BY_TYPE[type];
	return defineField({
		name: "route",
		title: "Route",
		type: "string",
		readOnly: true,
		description: `This page is served at ${route}. Set by the Next.js file router (the app/ directory), not by this field — it cannot be changed here.`,
		components: {
			input: createRouteDisplay(route),
		},
	});
}
