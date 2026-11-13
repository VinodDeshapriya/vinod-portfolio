#!/usr/bin/env node
/**
 * Reads BUTTON_VARIANTS from src/lib/buttonTypes.ts and writes the array into
 * the `variants` field of every `buttons` Link field found in slice model.json files.
 *
 * Run: npm run buttons:sync
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Read variants from buttonTypes.ts ─────────────────────────────────────────

const buttonTypesPath = join(ROOT, 'src/lib/buttonTypes.ts');
const source = readFileSync(buttonTypesPath, 'utf8');

const arrayMatch = source.match(/BUTTON_VARIANTS\s*=\s*\[([\s\S]*?)\]\s*as const/);
if (!arrayMatch) {
  console.error('❌  Could not find BUTTON_VARIANTS in src/lib/buttonTypes.ts');
  process.exit(1);
}

const variants = [...arrayMatch[1].matchAll(/variant:\s*["']([^"']+)["']/g)].map((m) => m[1]);

if (variants.length === 0) {
  console.error('❌  No variant names found in BUTTON_VARIANTS');
  process.exit(1);
}

console.log(`Found variants: ${variants.join(', ')}\n`);

// ── Find and update all model.json files ──────────────────────────────────────

import { readdirSync, statSync } from 'fs';

function findModelFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findModelFiles(full));
    } else if (entry === 'model.json') {
      results.push(full);
    }
  }
  return results;
}

const modelFiles = findModelFiles(join(ROOT, 'src'));
let updatedCount = 0;

function updateFields(fields) {
  let changed = false;
  for (const field of Object.values(fields ?? {})) {
    if (field.type === 'Link' && field.config?.variants !== undefined) {
      field.config.variants = variants;
      changed = true;
    }
    if (field.type === 'Group' && field.config?.fields) {
      if (updateFields(field.config.fields)) changed = true;
    }
  }
  return changed;
}

for (const filePath of modelFiles) {
  const model = JSON.parse(readFileSync(filePath, 'utf8'));
  let changed = false;

  for (const variation of model.variations ?? []) {
    for (const zone of ['primary', 'items']) {
      if (updateFields(variation[zone])) changed = true;
    }
  }

  if (changed) {
    writeFileSync(filePath, JSON.stringify(model, null, 2) + '\n');
    const rel = filePath.replace(ROOT + '/', '');
    console.log(`✅  Updated ${rel}`);
    updatedCount++;
  }
}

if (updatedCount === 0) {
  console.log('No model.json files with a `buttons` Link field were found.');
} else {
  console.log(`\nDone — ${updatedCount} file(s) updated.`);
}
