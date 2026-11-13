---
name: create-slice
description: Build a new Prismic slice in this repo from a Figma design — scan the existing slices for the house conventions, scaffold, model the fields the design needs, register it on the right custom types, then implement and verify it. Use when a task asks to create, add or build a new slice, section or block from a figma.com link, or names a section this project does not have yet.
---

# Create a slice from a Figma design

Covers getting a **new** slice into existence. Reading the design, reusing
tokens, publishing content and verifying in a browser are the
**`figma-to-prismic`** skill — follow it from step 5 onward.

## 1. First decide it is a slice at all

Open the design and compare it against what exists before scaffolding
anything. Most "new section" requests are not new slices:

- **Same structure, different styling or content** → a new **variation** on an
  existing slice. `HeroSection` carries five variations for exactly this.
- **A design set showing the same layout in two colourways** → one variation
  with a Theme select, not two.
- **Genuinely different structure and fields** → a new slice.

Getting this wrong is expensive: a needless slice fragments the editor's
choices and duplicates components that then drift apart. Say which way you
went and why.

## 2. Scan before you scaffold

Read the two or three existing slices closest to the design. They carry the
conventions the scaffold does not:

- `index.tsx` is a thin router when a slice has variations — it dispatches on
  `slice.variation` to `variants/<Name>/index.tsx`, each lazily imported with
  `next/dynamic`.
- Shared pieces live in `components/` inside the slice folder.
- `utils/` for slice-local helpers.
- Every slice's outer element carries `data-slice-type` and
  `data-slice-variation` — the browser checks in `figma-to-prismic` select on
  these, so keep them.

## 3. Scaffold

```
echo "Feature Grid" | npm run slice:create
```

**It prompts on stdin**, so pipe the name in — running it bare hangs in a
non-interactive shell.

It derives `FeatureGrid` (folder and component) and `feature_grid` (slice id),
writes `model.json`, `mocks.json` and `index.tsx` under `src/slices/`, and
registers the slice in `src/slices/index.ts`.

Two limits worth knowing:

- **It only writes to `src/slices`.** The `slices-blogs`, `slices-nav` and
  `slices-footer` libraries are hand-rolled — copy an existing member and add
  the entry to that library's `index.ts` yourself.
- **`src/slices/index.ts` says "generated, DO NOT EDIT"** but the script edits
  it. That is expected; keep the entries sorted as it leaves them.

## 4. Trim the scaffold to the design

The generated `primary` is the house standard — `top_padding`,
`bottom_padding`, `background_color`, `eyebrow`, `title`, `description`,
`buttons`. **Keep the ones the design uses and delete the rest.** The padding
selects are read by `StyledContainer` and the title group by
`StyledSectionTitle`, so keeping them buys working behaviour for free; keeping
ones the design has no room for just clutters the editor.

Then add what the design actually needs. Repeating content is a **Group**, not
numbered fields. Follow an existing field's JSON exactly rather than inventing
shapes, and hand-write the matching entries in `prismicio-types.d.ts`.

## 5. Register it where editors need it

A slice nobody can insert is invisible. Add its id to the `choices` of the
slice zone on every custom type that should offer it —
`customtypes/page/index.json` at minimum, plus `service` or `blog` when it
belongs there.

## 6. Fill in mocks.json

`mocks.json` is what the Slice Machine simulator renders, and it is the only
way to see the slice before any real content exists. Keep it in step with the
model — a mock missing a field the component reads makes the simulator look
broken when the component is fine.

## 7. Implement, then hand off

Build the component against the design with **`figma-to-prismic`**: its token
reuse rules, the `lg` breakpoint convention, the Slice Machine push, the
`screenshot-<variationId>.png` capture, the browser verification, and stopping
the processes you started.

Two things from that skill matter especially here, because a new slice hits
both:

- **Slice models cannot be pushed over MCP.** The slice does not exist in
  Prismic until the user runs Slice Machine, and no content can be written
  against it before then. Stop and ask.
- **The screenshot needs a second push** after the first one creates the slice.

Record the work with the **`update-progress`** skill.
