import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/lib/sanity/client";

/**
 * Enables Draft Mode for the Presentation tool.
 *
 * This is not a bare toggle — `defineEnableDraftMode` validates the preview
 * secret against the Sanity API before setting the cookie, so the endpoint
 * cannot be used to expose drafts to the public.
 */
export const { GET } = defineEnableDraftMode({
	client: client.withConfig({
		token: process.env.SANITY_API_READ_TOKEN,
	}),
});
