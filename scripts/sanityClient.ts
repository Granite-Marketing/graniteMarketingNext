import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../lib/sanity/env";

const token = process.env.SANITY_TOKEN;

if (!token) {
	// Fail fast if the write token isn't available
	throw new Error(
		"Missing SANITY_TOKEN environment variable. Set SANITY_TOKEN in .env.local to a Sanity API token with write access before running migration scripts."
	);
}

export const migrationClient = createClient({
	projectId,
	dataset,
	apiVersion,
	token,
	useCdn: false,
	perspective: "published",
});

export type SanityMutationResult = {
	transactionId?: string;
};
