import { runMigration } from "./migrationRunner";
import type { FaqInput } from "./migrationTypes";

async function main() {
  await runMigration<FaqInput>({
    label: "faqs",
    sourceFile: "scripts/migration-output/faqs.json",
    isArrayFile: true,
    mapRecord: (raw) => {
      if (raw._type !== "faq" || typeof raw._id !== "string") {
        return null;
      }
      return raw as unknown as FaqInput;
    },
    getId: (doc) => doc._id,
  });
}

void main();


