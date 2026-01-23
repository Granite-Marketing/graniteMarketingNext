import fs from "node:fs";
import path from "node:path";
import { migrationClient } from "./sanityClient";

interface ToolData {
	name: string;
	filename: string;
	integrationType?: string;
	description?: string;
	website?: string;
}

// Define the tools with their metadata
const tools: ToolData[] = [
	{
		name: "Airtable",
		filename: "airtable.svg",
		integrationType: "database",
		description: "Cloud collaboration platform for databases and workflows",
		website: "https://airtable.com",
	},
	{
		name: "GitHub",
		filename: "github.svg",
		integrationType: "internal",
		description: "Code hosting and version control platform",
		website: "https://github.com",
	},
	{
		name: "Gmail",
		filename: "gmail.svg",
		integrationType: "api",
		description: "Email service by Google",
		website: "https://gmail.com",
	},
	{
		name: "HubSpot",
		filename: "hubspot.svg",
		integrationType: "crm",
		description: "CRM and marketing automation platform",
		website: "https://hubspot.com",
	},
	{
		name: "JavaScript",
		filename: "javascript.svg",
		integrationType: "internal",
		description: "Programming language for web development",
	},
	{
		name: "Mailchimp",
		filename: "mailchimp.svg",
		integrationType: "ads",
		description: "Email marketing and automation platform",
		website: "https://mailchimp.com",
	},
	{
		name: "Next.js",
		filename: "nextjs.svg",
		integrationType: "internal",
		description: "React framework for production-grade applications",
		website: "https://nextjs.org",
	},
	{
		name: "Notion",
		filename: "notion.svg",
		integrationType: "cms",
		description: "All-in-one workspace for notes, docs, and collaboration",
		website: "https://notion.so",
	},
	{
		name: "PostgreSQL",
		filename: "postgres.svg",
		integrationType: "database",
		description: "Advanced open-source relational database",
		website: "https://postgresql.org",
	},
	{
		name: "Python",
		filename: "python.svg",
		integrationType: "internal",
		description: "High-level programming language",
		website: "https://python.org",
	},
	{
		name: "Slack",
		filename: "slack.svg",
		integrationType: "api",
		description: "Business communication and collaboration platform",
		website: "https://slack.com",
	},
	{
		name: "Supabase",
		filename: "supabase.svg",
		integrationType: "database",
		description: "Open-source Firebase alternative",
		website: "https://supabase.com",
	},
	{
		name: "Microsoft Teams",
		filename: "teams.svg",
		integrationType: "api",
		description: "Collaboration and communication platform",
		website: "https://teams.microsoft.com",
	},
	{
		name: "TypeScript",
		filename: "typescript.svg",
		integrationType: "internal",
		description: "Typed superset of JavaScript",
		website: "https://typescriptlang.org",
	},
	{
		name: "YouTube",
		filename: "youtube.svg",
		integrationType: "api",
		description: "Video sharing and streaming platform",
		website: "https://youtube.com",
	},
];

async function uploadSvgAsset(
	filePath: string,
	filename: string,
): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } }> {
	const fileBuffer = fs.readFileSync(filePath);

	try {
		const asset = await migrationClient.assets.upload("image", fileBuffer, {
			filename,
			contentType: "image/svg+xml",
		});

		return {
			_type: "image",
			asset: {
				_type: "reference",
				_ref: asset._id,
			},
		};
	} catch (error) {
		console.error(`Failed to upload ${filename}:`, error);
		throw error;
	}
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

async function main() {
	const logosDir = path.join(process.cwd(), "public/images/logos");
	const start = Date.now();
	let processed = 0;
	let failed = 0;

	console.log("\n=== Starting migration for tools ===");
	console.log(`Source: ${logosDir}`);
	console.log(`Total tools to process: ${tools.length}\n`);

	const transaction = migrationClient.transaction();

	for (const tool of tools) {
		const filePath = path.join(logosDir, tool.filename);

		if (!fs.existsSync(filePath)) {
			console.error(`❌ File not found: ${tool.filename}`);
			failed++;
			continue;
		}

		try {
			console.log(`📤 Uploading ${tool.filename}...`);
			const imageAsset = await uploadSvgAsset(filePath, tool.filename);

			const slug = slugify(tool.name);
			const toolDoc = {
				_type: "tool",
				_id: `tool-${slug}`,
				name: tool.name,
				slug: {
					_type: "slug",
					current: slug,
				},
				integrationType: tool.integrationType,
				description: tool.description,
				logo: {
					...imageAsset,
					alt: `${tool.name} logo`,
				},
				website: tool.website,
			};

			transaction.createOrReplace(toolDoc);
			console.log(`✅ Processed: ${tool.name}`);
			processed++;
		} catch (error) {
			console.error(`❌ Failed to process ${tool.name}:`, error);
			failed++;
		}
	}

	try {
		const result = await transaction.commit();
		console.log(
			`\n✅ Committed ${processed} tool document(s) in transaction ${result.transactionId}`,
		);
	} catch (error) {
		console.error("\n❌ Failed to commit transaction:", error);
	}

	const durationMs = Date.now() - start;
	console.log(
		`\nFinished migration: processed=${processed}, failed=${failed}, time=${durationMs}ms`,
	);
}

void main();
