import type { PortableTextBlock } from "@portabletext/types";

// Average reading speed: 200-250 words per minute
const WORDS_PER_MINUTE = 225;

/**
 * Calculates estimated read time from Portable Text content
 * @param content - Array of PortableTextBlock from Sanity
 * @returns Formatted read time string (e.g., "5 min read")
 */
export function calculateReadTime(content: PortableTextBlock[]): string {
	if (!content || content.length === 0) {
		return "1 min read";
	}

	// Extract all text from portable text blocks
	const text = extractTextFromPortableText(content);

	// Count words
	const wordCount = text.trim().split(/\s+/).length;

	// Calculate minutes (round up, minimum 1 minute)
	const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

	// Format output
	return minutes === 1 ? "1 min read" : `${minutes} min read`;
}

/**
 * Recursively extracts plain text from Portable Text blocks
 */
function extractTextFromPortableText(blocks: any[]): string {
	return blocks
		.map((block) => {
			if (block._type === "block" && block.children) {
				return block.children
					.map((child: any) => child.text || "")
					.join(" ");
			}
			// Handle other block types if needed (images, code blocks, etc.)
			return "";
		})
		.join(" ");
}
