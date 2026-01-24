import { client } from "../client";

type FetchOptions = {
	revalidateSeconds?: number;
};

// Detect environment - development has no caching for immediate updates
const isDevelopment = process.env.NODE_ENV === "development";
const defaultRevalidate = isDevelopment ? 0 : 3600;

export async function fetchQuery<T>(
	query: string,
	params: Record<string, any> = {},
	options: FetchOptions = {}
): Promise<T> {
	const revalidate = options.revalidateSeconds ?? defaultRevalidate;

	// Next.js `next` options are ignored outside of app router,
	// but this keeps the API similar to MLN.
	const fetchOptions: any =
		typeof revalidate === "number" ? { next: { revalidate } } : {};

	return client.fetch<T>(query, params, fetchOptions);
}
