import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../lib/sanity/env";

const token =
	process.env.SANITY_TOKEN ||
	"sk1Dp28QMzLgb2NbQgt5GmeyOE1xcC3gXMXGNubxdElkT0johWufZa4tboOTLUex3g7X0zaeGIBdAWLCLD8qoAxPtf9rSG0jLO1dvuWhqszc8kz0HUpyiFXb2QVYmFaMTImJXuyJSJ5xZUZKYOanYhTB1WhnStp2SllIjzQVYewq8RTyxyVd";

if (!token) {
	// Fail fast if the write token isn't available
	throw new Error(
		"Missing SANITY_TOKEN environment variable for migration scripts"
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
