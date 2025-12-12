/**
 * Content Migration Script
 * 
 * This script migrates content from Webflow CSV exports to Sanity CMS.
 * 
 * Usage:
 *   npx ts-node scripts/migrate-content.ts
 * 
 * Environment variables required:
 *   - SANITY_PROJECT_ID: Your Sanity project ID
 *   - SANITY_DATASET: Your Sanity dataset (e.g., "production")
 *   - SANITY_TOKEN: A Sanity API token with write access
 * 
 * CSV files expected in /old-cms-content/:
 *   - Granite Automations - Blog Posts.csv
 *   - Granite Automations - Case Studies.csv
 *   - Granite Automations - Categories 📦s.csv
 *   - Granite Automations - Clients 🖼️s.csv
 *   - Granite Automations - FAQs 📦s.csv
 *   - Granite Automations - Location 📦s.csv
 *   - Granite Automations - Logo List 📦s.csv
 */

import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

// Types for parsed CSV data
interface BlogPostRow {
  Title: string;
  Slug: string;
  "Item ID": string;
  Archived: string;
  Draft: string;
  "Published On": string;
  "Created On": string;
  "Updated On": string;
  "SEO - Meta Title": string;
  "SEO - Meta Description": string;
  Category: string;
  "Main Image": string;
  "Thumbnail image": string;
  "Post Body": string;
  "Post Summary": string;
  "Featured?": string;
  Color: string;
}

interface CaseStudyRow {
  Name: string;
  Slug: string;
  "Item ID": string;
  Archived: string;
  Draft: string;
  "Published On": string;
  Location: string;
  "SEO - Meta Title": string;
  "SEO - Meta Description": string;
  "Loom Walkthrough URL": string;
  "Hero - Image": string;
  "Hero - Introduction": string;
  "Card - Image": string;
  "Card - Title": string;
  "Card - Description": string;
  "Tech Stack - Description": string;
  "Tech Stack Item 1 - Title": string;
  "Tech Stack Item 1 - Description": string;
  "Tech Stack Item 1 - Image": string;
  "Tech Stack Item 2 - Title": string;
  "Tech Stack Item 2 - Description": string;
  "Tech Stack Item 2 - Image": string;
  "Tech Stack Item 3 - Title": string;
  "Tech Stack Item 3 - Description": string;
  "Tech Stack Item 3 - Image": string;
  "Tech Stack Item 4 - Title": string;
  "Tech Stack Item 4 - Description": string;
  "Tech Stack Item 4 - Image": string;
  "Results - Description": string;
  "Result 1 - Stat": string;
  "Result 1 - Title": string;
  "Result 1 - Description": string;
  "Result 2 - Stat": string;
  "Result 2 - Title": string;
  "Result 2 - Description": string;
  "Result 3 - Stat": string;
  "Result 3 - Title": string;
  "Result 3 - Description": string;
  Testimonial: string;
}

interface CategoryRow {
  Name: string;
  Slug: string;
  "Item ID": string;
  Archived: string;
  Draft: string;
  "Published On": string;
}

interface ClientRow {
  Name: string;
  Slug: string;
  "Item ID": string;
  Archived: string;
  Draft: string;
  "Published On": string;
  "Company Logo": string;
  "Client Headshot": string;
  "Author Name": string;
  "Author Company": string;
  Testimonial: string;
  "Date Started": string;
  Location: string;
}

interface FAQRow {
  Name: string;
  Slug: string;
  "Item ID": string;
  Archived: string;
  Draft: string;
  "Published On": string;
  Answer: string;
}

interface LocationRow {
  Name: string;
  Slug: string;
  "Item ID": string;
  Archived: string;
  Draft: string;
  "Published On": string;
}

interface LogoListRow {
  "Client Name": string;
  Slug: string;
  "Item ID": string;
  Archived: string;
  Draft: string;
  "Published On": string;
  "Sort Order": string;
  Logo: string;
}

// Helper function to read CSV file
function readCSV<T>(filename: string): T[] {
  const csvPath = path.join(process.cwd(), "old-cms-content", filename);
  
  if (!fs.existsSync(csvPath)) {
    console.log(`⚠️ File not found: ${filename}`);
    return [];
  }
  
  const content = fs.readFileSync(csvPath, "utf-8");
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });
}

// Helper to convert HTML to Portable Text blocks (simplified)
function htmlToPortableText(html: string): object[] {
  if (!html) return [];
  
  // This is a simplified conversion - for production, use a proper HTML to Portable Text converter
  // like @sanity/block-tools or htmlToBlocks
  
  // Remove HTML tags for simple text extraction
  const textContent = html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
  
  if (!textContent) return [];
  
  // Create a simple paragraph block
  return [
    {
      _type: "block",
      _key: Math.random().toString(36).substring(7),
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: Math.random().toString(36).substring(7),
          text: textContent,
          marks: [],
        },
      ],
    },
  ];
}

// Transform functions for each content type
function transformBlogPost(row: BlogPostRow, categorySlugToId: Map<string, string>) {
  if (row.Archived === "true") return null;
  
  const categoryId = categorySlugToId.get(row.Category);
  
  return {
    _type: "blogPost",
    _id: `blogPost-${row.Slug}`,
    title: row.Title,
    slug: { _type: "slug", current: row.Slug },
    publishedAt: row["Published On"] ? new Date(row["Published On"]).toISOString() : undefined,
    excerpt: row["Post Summary"],
    content: htmlToPortableText(row["Post Body"]),
    featuredImage: row["Main Image"] ? {
      _type: "image",
      alt: row.Title,
      // Note: You'll need to upload images separately and reference them
      _externalUrl: row["Main Image"],
    } : undefined,
    categories: categoryId ? [{ _type: "reference", _ref: categoryId }] : [],
    seo: {
      metaTitle: row["SEO - Meta Title"],
      metaDescription: row["SEO - Meta Description"],
    },
    featured: row["Featured?"] === "true",
    color: row.Color,
  };
}

function transformCaseStudy(row: CaseStudyRow, clientSlugToId: Map<string, string>) {
  if (row.Archived === "true") return null;
  
  const testimonialId = clientSlugToId.get(row.Testimonial);
  
  // Build tech stack array
  const techStack = [];
  for (let i = 1; i <= 4; i++) {
    const title = row[`Tech Stack Item ${i} - Title` as keyof CaseStudyRow];
    if (title) {
      techStack.push({
        _key: `tech-${i}`,
        title,
        description: row[`Tech Stack Item ${i} - Description` as keyof CaseStudyRow],
        imageUrl: row[`Tech Stack Item ${i} - Image` as keyof CaseStudyRow],
      });
    }
  }
  
  // Build results array
  const results = [];
  for (let i = 1; i <= 3; i++) {
    const stat = row[`Result ${i} - Stat` as keyof CaseStudyRow];
    if (stat) {
      results.push({
        _key: `result-${i}`,
        value: stat,
        metric: row[`Result ${i} - Title` as keyof CaseStudyRow],
        description: row[`Result ${i} - Description` as keyof CaseStudyRow],
      });
    }
  }
  
  return {
    _type: "caseStudy",
    _id: `caseStudy-${row.Slug}`,
    title: row.Name,
    slug: { _type: "slug", current: row.Slug },
    client: row["Card - Title"] || row.Name,
    industry: row.Location || "Technology",
    excerpt: row["Card - Description"],
    featuredImage: row["Hero - Image"] ? {
      _type: "image",
      alt: row.Name,
      _externalUrl: row["Hero - Image"],
    } : undefined,
    challenge: htmlToPortableText(row["Hero - Introduction"]),
    solution: htmlToPortableText(row["Tech Stack - Description"]),
    techStack,
    results,
    testimonial: testimonialId ? { _type: "reference", _ref: testimonialId } : undefined,
    loomUrl: row["Loom Walkthrough URL"],
    seo: {
      metaTitle: row["SEO - Meta Title"],
      metaDescription: row["SEO - Meta Description"],
    },
  };
}

function transformCategory(row: CategoryRow) {
  if (row.Archived === "true") return null;
  
  return {
    _type: "category",
    _id: `category-${row.Slug}`,
    name: row.Name,
    slug: { _type: "slug", current: row.Slug },
  };
}

function transformClient(row: ClientRow, locationSlugToId: Map<string, string>) {
  if (row.Archived === "true") return null;
  
  const locationId = locationSlugToId.get(row.Location);
  
  return {
    _type: "client",
    _id: `client-${row.Slug}`,
    name: row.Name,
    slug: { _type: "slug", current: row.Slug },
    authorName: row["Author Name"],
    company: row["Author Company"],
    testimonial: htmlToPortableText(row.Testimonial),
    dateStarted: row["Date Started"] ? new Date(row["Date Started"]).toISOString().split("T")[0] : undefined,
    location: locationId ? { _type: "reference", _ref: locationId } : undefined,
    companyLogo: row["Company Logo"] ? {
      _type: "image",
      alt: `${row["Author Company"]} logo`,
      _externalUrl: row["Company Logo"],
    } : undefined,
    headshot: row["Client Headshot"] ? {
      _type: "image",
      alt: row["Author Name"],
      _externalUrl: row["Client Headshot"],
    } : undefined,
  };
}

function transformFAQ(row: FAQRow, index: number) {
  if (row.Archived === "true") return null;
  
  return {
    _type: "faq",
    _id: `faq-${row.Slug}`,
    question: row.Name,
    slug: { _type: "slug", current: row.Slug },
    answer: htmlToPortableText(row.Answer),
    order: index + 1,
    category: "general",
  };
}

function transformLocation(row: LocationRow) {
  if (row.Archived === "true") return null;
  
  return {
    _type: "location",
    _id: `location-${row.Slug}`,
    name: row.Name,
    slug: { _type: "slug", current: row.Slug },
  };
}

function transformLogoList(row: LogoListRow) {
  if (row.Archived === "true") return null;
  
  return {
    _type: "logoList",
    _id: `logoList-${row.Slug}`,
    clientName: row["Client Name"],
    slug: { _type: "slug", current: row.Slug },
    sortOrder: parseInt(row["Sort Order"]) || 99,
    logo: row.Logo ? {
      _type: "image",
      alt: `${row["Client Name"]} logo`,
      _externalUrl: row.Logo,
    } : undefined,
    featured: true,
  };
}

// Main migration function
async function migrate() {
  console.log("🚀 Starting content migration...\n");
  
  // Check for required environment variables
  const requiredEnvVars = ["SANITY_PROJECT_ID", "SANITY_DATASET", "SANITY_TOKEN"];
  const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);
  
  if (missingEnvVars.length > 0) {
    console.log("⚠️  Missing environment variables:", missingEnvVars.join(", "));
    console.log("   Running in DRY RUN mode - will generate JSON output instead\n");
  }
  
  // Read all CSV files
  console.log("📖 Reading CSV files...");
  
  const locations = readCSV<LocationRow>("Granite Automations - Location 📦s.csv");
  const categories = readCSV<CategoryRow>("Granite Automations - Categories 📦s.csv");
  const clients = readCSV<ClientRow>("Granite Automations - Clients 🖼️s.csv");
  const faqs = readCSV<FAQRow>("Granite Automations - FAQs 📦s.csv");
  const logoList = readCSV<LogoListRow>("Granite Automations - Logo List 📦s.csv");
  const blogPosts = readCSV<BlogPostRow>("Granite Automations - Blog Posts.csv");
  const caseStudies = readCSV<CaseStudyRow>("Granite Automations - Case Studies.csv");
  
  console.log(`   ✓ Locations: ${locations.length}`);
  console.log(`   ✓ Categories: ${categories.length}`);
  console.log(`   ✓ Clients: ${clients.length}`);
  console.log(`   ✓ FAQs: ${faqs.length}`);
  console.log(`   ✓ Logo List: ${logoList.length}`);
  console.log(`   ✓ Blog Posts: ${blogPosts.length}`);
  console.log(`   ✓ Case Studies: ${caseStudies.length}\n`);
  
  // Transform data
  console.log("🔄 Transforming data...");
  
  // Transform locations first (needed for references)
  const transformedLocations = locations
    .map(transformLocation)
    .filter((item): item is NonNullable<typeof item> => item !== null);
  
  const locationSlugToId = new Map(
    transformedLocations.map((loc) => [loc.slug.current, loc._id])
  );
  
  // Transform categories (needed for blog post references)
  const transformedCategories = categories
    .map(transformCategory)
    .filter((item): item is NonNullable<typeof item> => item !== null);
  
  const categorySlugToId = new Map(
    transformedCategories.map((cat) => [cat.slug.current, cat._id])
  );
  
  // Transform clients (needed for case study testimonial references)
  const transformedClients = clients
    .map((row) => transformClient(row, locationSlugToId))
    .filter((item): item is NonNullable<typeof item> => item !== null);
  
  const clientSlugToId = new Map(
    transformedClients.map((client) => [client.slug.current, client._id])
  );
  
  // Transform remaining content types
  const transformedFAQs = faqs
    .map((row, index) => transformFAQ(row, index))
    .filter((item): item is NonNullable<typeof item> => item !== null);
  
  const transformedLogoList = logoList
    .map(transformLogoList)
    .filter((item): item is NonNullable<typeof item> => item !== null);
  
  const transformedBlogPosts = blogPosts
    .map((row) => transformBlogPost(row, categorySlugToId))
    .filter((item): item is NonNullable<typeof item> => item !== null);
  
  const transformedCaseStudies = caseStudies
    .map((row) => transformCaseStudy(row, clientSlugToId))
    .filter((item): item is NonNullable<typeof item> => item !== null);
  
  console.log(`   ✓ Locations: ${transformedLocations.length}`);
  console.log(`   ✓ Categories: ${transformedCategories.length}`);
  console.log(`   ✓ Clients: ${transformedClients.length}`);
  console.log(`   ✓ FAQs: ${transformedFAQs.length}`);
  console.log(`   ✓ Logo List: ${transformedLogoList.length}`);
  console.log(`   ✓ Blog Posts: ${transformedBlogPosts.length}`);
  console.log(`   ✓ Case Studies: ${transformedCaseStudies.length}\n`);
  
  // Combine all documents
  const allDocuments = [
    ...transformedLocations,
    ...transformedCategories,
    ...transformedClients,
    ...transformedFAQs,
    ...transformedLogoList,
    ...transformedBlogPosts,
    ...transformedCaseStudies,
  ];
  
  // Output results
  const outputDir = path.join(process.cwd(), "scripts", "migration-output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write NDJSON file (Sanity import format)
  const ndjsonPath = path.join(outputDir, "sanity-import.ndjson");
  const ndjsonContent = allDocuments
    .map((doc) => JSON.stringify(doc))
    .join("\n");
  fs.writeFileSync(ndjsonPath, ndjsonContent);
  
  // Write individual JSON files for review
  fs.writeFileSync(
    path.join(outputDir, "locations.json"),
    JSON.stringify(transformedLocations, null, 2)
  );
  fs.writeFileSync(
    path.join(outputDir, "categories.json"),
    JSON.stringify(transformedCategories, null, 2)
  );
  fs.writeFileSync(
    path.join(outputDir, "clients.json"),
    JSON.stringify(transformedClients, null, 2)
  );
  fs.writeFileSync(
    path.join(outputDir, "faqs.json"),
    JSON.stringify(transformedFAQs, null, 2)
  );
  fs.writeFileSync(
    path.join(outputDir, "logo-list.json"),
    JSON.stringify(transformedLogoList, null, 2)
  );
  fs.writeFileSync(
    path.join(outputDir, "blog-posts.json"),
    JSON.stringify(transformedBlogPosts, null, 2)
  );
  fs.writeFileSync(
    path.join(outputDir, "case-studies.json"),
    JSON.stringify(transformedCaseStudies, null, 2)
  );
  
  console.log("📁 Output files generated:");
  console.log(`   ✓ ${ndjsonPath}`);
  console.log(`   ✓ ${path.join(outputDir, "*.json")} (individual files)\n`);
  
  console.log("📝 Next steps:");
  console.log("   1. Review the generated JSON files in scripts/migration-output/");
  console.log("   2. Set up your Sanity project and get API credentials");
  console.log("   3. Import using: sanity dataset import scripts/migration-output/sanity-import.ndjson");
  console.log("   4. Upload images separately and update references\n");
  
  console.log("✅ Migration preparation complete!");
  console.log(`   Total documents: ${allDocuments.length}\n`);
  
  // Summary statistics
  console.log("📊 Content Summary:");
  console.log("   ┌────────────────────┬───────┐");
  console.log("   │ Content Type       │ Count │");
  console.log("   ├────────────────────┼───────┤");
  console.log(`   │ Locations          │ ${String(transformedLocations.length).padStart(5)} │`);
  console.log(`   │ Categories         │ ${String(transformedCategories.length).padStart(5)} │`);
  console.log(`   │ Clients            │ ${String(transformedClients.length).padStart(5)} │`);
  console.log(`   │ FAQs               │ ${String(transformedFAQs.length).padStart(5)} │`);
  console.log(`   │ Logo List          │ ${String(transformedLogoList.length).padStart(5)} │`);
  console.log(`   │ Blog Posts         │ ${String(transformedBlogPosts.length).padStart(5)} │`);
  console.log(`   │ Case Studies       │ ${String(transformedCaseStudies.length).padStart(5)} │`);
  console.log("   ├────────────────────┼───────┤");
  console.log(`   │ Total              │ ${String(allDocuments.length).padStart(5)} │`);
  console.log("   └────────────────────┴───────┘");
}

// Run migration
migrate().catch(console.error);
