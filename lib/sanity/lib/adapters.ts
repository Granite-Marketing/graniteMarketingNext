import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "../client";

// Shared front-end facing types for mapped Sanity content
export type LogoItem = {
	id: string;
	name: string;
	slug: string;
	logoUrl: string;
	website?: string;
};

export type TestimonialItem = {
	id: string;
	authorName: string;
	company?: string;
	role?: string;
	quote: any[]; // Portable Text blocks
	locationName?: string;
	headshotUrl?: string;
	companyLogoUrl?: string;
};

export type FAQItem = {
	id: string;
	question: string;
	slug: string;
	answer: any[]; // Portable Text blocks
	order?: number;
	category?: string;
};

export type BlogPostCard = {
	id: string;
	title: string;
	slug: string;
	excerpt?: string;
	publishedAt?: string;
	featuredImageUrl?: string;
	categories?: { id: string; name: string; slug: string }[];
};

export function getImageUrl(source: SanityImageSource | null | undefined) {
	if (!source) return "";
	// Delegate to the more robust helper that understands _externalUrl
	return urlFor(source as any);
}

export function adaptLogoListItem(doc: any): LogoItem {
	return {
		id: doc._id,
		name: doc.clientName,
		slug: doc.slug?.current ?? "",
		logoUrl: getImageUrl(doc.logo),
		website: doc.website,
	};
}

export function adaptClientTestimonial(
	doc: any,
	locationName?: string
): TestimonialItem {
	return {
		id: doc._id,
		authorName: doc.authorName ?? doc.name,
		company: doc.company,
		role: doc.role,
		quote: doc.testimonial ?? [],
		locationName,
		headshotUrl: getImageUrl(doc.headshot),
		companyLogoUrl: getImageUrl(doc.companyLogo),
	};
}

export function adaptFAQItem(doc: any): FAQItem {
	return {
		id: doc._id,
		question: doc.question,
		slug: doc.slug?.current ?? "",
		answer: doc.answer ?? [],
		order: doc.order,
		category: doc.category,
	};
}

export function adaptBlogPostToCard(doc: any): BlogPostCard {
	return {
		id: doc._id,
		title: doc.title,
		slug: doc.slug?.current ?? "",
		excerpt: doc.excerpt,
		publishedAt: doc.publishedAt,
		featuredImageUrl: getImageUrl(doc.featuredImage),
		categories:
			doc.categories?.map((cat: any) => ({
				id: cat._id,
				name: cat.name,
				slug: cat.slug?.current ?? "",
			})) ?? [],
	};
}
