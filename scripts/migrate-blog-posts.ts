import { runMigration } from "./migrationRunner";
import type { BlogPostInput } from "./migrationTypes";

async function main() {
  await runMigration<BlogPostInput>({
    label: "blog posts",
    sourceFile: "scripts/migration-output/blog-posts.json",
    isArrayFile: true,
    mapRecord: (raw) => {
      if (raw._type !== "blogPost" || typeof raw._id !== "string") {
        return null;
      }
      return raw as unknown as BlogPostInput;
    },
    getId: (doc) => doc._id,
  });
}

void main();


