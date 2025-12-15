import { runMigration } from "./migrationRunner";
import type { CaseStudyInput } from "./migrationTypes";

async function main() {
  await runMigration<CaseStudyInput>({
    label: "case studies",
    sourceFile: "scripts/migration-output/case-studies.json",
    isArrayFile: true,
    mapRecord: (raw) => {
      if (raw._type !== "caseStudy" || typeof raw._id !== "string") {
        return null;
      }
      return raw as CaseStudyInput;
    },
    getId: (doc) => doc._id,
  });
}

void main();


