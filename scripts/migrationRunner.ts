import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { migrationClient, SanityMutationResult } from "./sanityClient";

type JSONRecord = Record<string, unknown>;

export interface MigrationOptions<T> {
  /** Label used in logs, e.g. \"blog posts\" */
  label: string;
  /** Path to the source file (absolute or relative to project root) */
  sourceFile: string;
  /** Whether the file is an array of JSON objects (true) or NDJSON (false) */
  isArrayFile?: boolean;
  /** Map raw JSON to a Sanity document; return null/undefined to skip */
  mapRecord: (raw: JSONRecord) => T | null | undefined;
  /** Extract a stable id for createOrReplace */
  getId: (record: T) => string;
}

interface MigrationStats {
  processed: number;
  skipped: number;
  failed: number;
}

export async function runMigration<T extends { _type?: string }>(
  options: MigrationOptions<T>,
): Promise<SanityMutationResult & MigrationStats> {
  const { label, sourceFile, isArrayFile = true, mapRecord, getId } = options;

  const resolvedPath = path.isAbsolute(sourceFile)
    ? sourceFile
    : path.join(process.cwd(), sourceFile);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Migration source file not found: ${resolvedPath}`);
  }

  const start = Date.now();
  const stats: MigrationStats = { processed: 0, skipped: 0, failed: 0 };

  console.log(`\n=== Starting migration for ${label} ===`);
  console.log(`Source: ${resolvedPath}`);

  const docs: T[] = [];

  if (isArrayFile) {
    const fileData = fs.readFileSync(resolvedPath, "utf8");
    const parsed = JSON.parse(fileData) as JSONRecord[];

    for (const raw of parsed) {
      const mapped = mapRecord(raw);
      if (!mapped) {
        stats.skipped += 1;
        continue;
      }
      docs.push(mapped);
    }
  } else {
    const fileStream = fs.createReadStream(resolvedPath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      try {
        const raw = JSON.parse(trimmed) as JSONRecord;
        const mapped = mapRecord(raw);
        if (!mapped) {
          stats.skipped += 1;
          continue;
        }
        docs.push(mapped);
      } catch (error) {
        stats.failed += 1;
        console.error(`Failed to parse NDJSON line: ${(error as Error).message}`);
      }
    }
  }

  if (!docs.length) {
    console.log(`No valid ${label} records found to migrate.`);
    return { transactionId: undefined, ...stats };
  }

  // Upsert using a transaction for idempotency
  let transaction = migrationClient.transaction();

  for (const doc of docs) {
    const id = getId(doc);
    if (!id) {
      stats.skipped += 1;
      continue;
    }

    // Ensure _type is present for Sanity document
    const docWithType = { ...doc, _id: id };
    if (!docWithType._type) {
      stats.skipped += 1;
      continue;
    }

    transaction = transaction.createOrReplace(docWithType as typeof docWithType & { _type: string });
    stats.processed += 1;
  }

  let result: SanityMutationResult = {};
  try {
    const commitResult = await transaction.commit();
    result = { transactionId: commitResult.transactionId };
    console.log(
      `Committed ${stats.processed} ${label} document(s) in transaction ${commitResult.transactionId}`,
    );
  } catch (error) {
    stats.failed += docs.length;
    console.error(`Failed to commit ${label} migration:`, error);
  }

  const durationMs = Date.now() - start;
  console.log(
    `Finished migration for ${label}: processed=${stats.processed}, skipped=${stats.skipped}, failed=${stats.failed}, time=${durationMs}ms`,
  );

  return { ...result, ...stats };
}


