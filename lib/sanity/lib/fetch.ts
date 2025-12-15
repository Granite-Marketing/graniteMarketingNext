import { client } from "../client";

type FetchOptions = {
	revalidateSeconds?: number;
};

const defaultRevalidate = process.env.USE_CACHE === "true" ? 3600 : 0;

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
