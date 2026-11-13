// Splits array into groups of `size`. Last group can be smaller.
function chunkBySize<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size)); // grab next chunk
  }
  return rows;
}

// True if the last row has just 1 item (looks bad, needs fixing).
function isLastRowLonely<T>(rows: T[][]): boolean {
  const lastRow = rows[rows.length - 1];
  return lastRow.length === 1;
}

// Groups items into rows for display. Prefers rows of 4.
export function chunkTrustItems<T>(items: T[]): T[][] {
  if (items.length <= 4) return items.length ? [items] : []; // fits in 1 row

  let rows = chunkBySize(items, 4); // step 1: try rows of 4

  if (isLastRowLonely(rows)) {
    rows = chunkBySize(items, 3); // step 2: try rows of 3 instead
  }

  if (isLastRowLonely(rows)) {
    // step 3: still lonely (rare) -> merge last 2 rows, split evenly
    const lastRow = rows.pop()!;
    const secondLastRow = rows.pop()!;
    const merged = [...secondLastRow, ...lastRow];
    rows.push(merged.slice(0, -2), merged.slice(-2));
  }

  return rows;
}

// Column width matches row 1's item count (1-4), with gap-x-6 (24px)
// subtracted before dividing so columns + gaps never exceed 100%.
export const ITEM_WIDTH_CLASSES: Record<number, string> = {
  1: "w-full",
  2: "w-[calc((100%-24px)/2)]",
  3: "w-[calc((100%-48px)/3)]",
  4: "w-[calc((100%-72px)/4)]",
};
