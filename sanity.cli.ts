import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
	api: {
		projectId: "0p8nq3lx",
		dataset: "production",
	},
	/**
	 * Enable auto-updates for studios.
	 * Learn more at https://www.sanity.io/docs/cli#auto-updates
	 *
	 * Note: this does nothing for an embedded Studio — Next.js cannot do the
	 * ESM import maps auto-updates rely on. Left in place rather than removed
	 * because it becomes live if the Studio is ever split out.
	 */
	autoUpdates: true,

	/**
	 * GROQ typegen (U5 of the Sanity page builder plan).
	 *
	 * Config lives here rather than in `sanity-typegen.json`, which is
	 * deprecated. The `typegen` key landed in Sanity 4.19.0 and this repo
	 * pins 4.21.1.
	 *
	 * `path` is explicit because the default assumes `./src`, which this repo
	 * does not use — leaving it default silently finds zero queries.
	 *
	 * Deliberately absent: `enabled: true` and `--watch`. Both require Studio
	 * 5.8.0+, so on this pin the workflow is a manual `npm run typegen` after
	 * any schema or query change.
	 */
	typegen: {
		path: [
			"./app/**/*.{ts,tsx}",
			"./components/**/*.{ts,tsx}",
			"./lib/**/*.{ts,tsx}",
		],
		schema: "schema.json",
		generates: "./sanity.types.ts",
		overloadClientMethods: true,
	},
});
