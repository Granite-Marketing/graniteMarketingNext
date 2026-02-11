import { Navigation } from "@/components/navigation";
import { ContentHero } from "@/components/content-hero";
import { TemplateGrid } from "@/components/template-grid";
import { ContentCtaBanner } from "@/components/content-cta-banner";
import { Footer } from "@/components/footer";
import { getWorkflowTemplates } from "@/lib/sanity/queries";
import { getImageUrl } from "@/lib/sanity/lib/adapters";
export const metadata = {
	title:
		"Workflow Templates - Granite Marketing | Ready-to-Use n8n Automations",
	description:
		"Browse our library of ready-to-use n8n workflow templates. Download, customize, and automate your business processes in minutes.",
};

export const revalidate = 3600;

type SanityWorkflowTemplate = {
	_id: string;
	slug?: { current?: string };
	title: string;
	excerpt?: string;
	publishedAt?: string;
	featuredImage?: unknown;
	categories?: { name?: string }[];
	featured?: boolean;
	n8nUrl?: string;
	youtubeUrl?: string;
	loomUrl?: string;
};

export default async function TemplatesPage() {
	const templatesFromSanity =
		(await getWorkflowTemplates()) as SanityWorkflowTemplate[];

	const posts =
		templatesFromSanity?.map((template) => ({
			id: template._id,
			slug: template.slug?.current ?? "",
			title: template.title,
			description: template.excerpt ?? "",
			category: template.categories?.[0]?.name ?? "Template",
			date: template.publishedAt
				? new Date(template.publishedAt).toLocaleDateString(undefined, {
						year: "numeric",
						month: "short",
						day: "numeric",
					})
				: "",
			image: getImageUrl(template.featuredImage as any) ?? "",
			featured: template.featured ?? false,
			n8nUrl: template.n8nUrl,
			youtubeUrl: template.youtubeUrl,
			loomUrl: template.loomUrl,
		})) ?? [];

	return (
		<>
			<Navigation />
			<main className="min-h-screen">
				<ContentHero
					tag="Workflow Templates"
					heading="Ready-to-use workflow templates"
					subtitle="Browse our collection of pre-built n8n workflow templates. Download, customize, and start automating your business processes today."
					patternId="templates-grid"
				/>
				<TemplateGrid posts={posts} />
				<ContentCtaBanner />
			</main>
			<Footer />
		</>
	);
}
