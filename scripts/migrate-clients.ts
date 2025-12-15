import { runMigration } from "./migrationRunner";
import type { ClientInput } from "./migrationTypes";

async function main() {
  await runMigration<ClientInput>({
    label: "clients",
    sourceFile: "scripts/migration-output/clients.json",
    isArrayFile: true,
    mapRecord: (raw) => {
      if (raw._type !== "client" || typeof raw._id !== "string") {
        return null;
      }
      return raw as ClientInput;
    },
    getId: (doc) => doc._id,
  });
}

void main();


