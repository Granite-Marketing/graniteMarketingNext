import { runMigration } from "./migrationRunner";
import type { CategoryInput } from "./migrationTypes";

async function main() {
  await runMigration<CategoryInput>({
    label: "categories",
    sourceFile: "scripts/migration-output/categories.json",
    isArrayFile: true,
    mapRecord: (raw) => {
      if (raw._type !== "category" || typeof raw._id !== "string") {
        return null;
      }

      return raw as unknown as CategoryInput;
    },
    getId: (doc) => doc._id,
  });
}

void main();


