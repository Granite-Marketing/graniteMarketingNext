import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// scripts/sanityClient.ts throws at module-evaluation time when SANITY_TOKEN
// is unset, so each scenario needs a fresh module registry and a dynamic
// import wrapped in an assertion that can observe the rejection.
describe("scripts/sanityClient", () => {
	const originalToken = process.env.SANITY_TOKEN;

	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		if (originalToken === undefined) {
			delete process.env.SANITY_TOKEN;
		} else {
			process.env.SANITY_TOKEN = originalToken;
		}
	});

	it("throws a descriptive error naming SANITY_TOKEN and .env.local, instead of silently constructing a client, when SANITY_TOKEN is unset", async () => {
		delete process.env.SANITY_TOKEN;

		await expect(import("../../scripts/sanityClient")).rejects.toThrow(
			/SANITY_TOKEN/
		);

		vi.resetModules();

		try {
			await import("../../scripts/sanityClient");
			throw new Error("expected import to throw");
		} catch (error) {
			expect((error as Error).message).toContain("SANITY_TOKEN");
			expect((error as Error).message).toContain(".env.local");
		}
	});

	it("constructs the migration client without throwing when SANITY_TOKEN is set", async () => {
		process.env.SANITY_TOKEN = "test-token-not-a-real-credential";

		const { migrationClient } = await import("../../scripts/sanityClient");

		expect(migrationClient).toBeDefined();
	});
});
