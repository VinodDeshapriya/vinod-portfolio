---
name: figma-to-prismic
description: Implement a Figma design in this repo end to end — read the design, build it from the project's existing tokens and components, model and publish the content in Prismic, then verify it in a real browser. Use whenever a task starts from a figma.com link or asks to build, restyle or fix a header, footer, hero, slice, slice variation or any page section. Also use when a change needs new Prismic fields, a new slice variation, or assets uploaded to the media library.
---

# Figma → code → Prismic → verified

The loop this project uses. Each stage depends on the one before it; the
Prismic stages in particular have two hard stops that will waste an hour if
you meet them unprepared (see **Hard stops**).

## 0. Before writing any code

`AGENTS.md` is not boilerplate: **this is Next.js 16 and the APIs differ from
training data.** Read the relevant guide under `node_modules/next/dist/docs/`
before using a Next API you have not already used in this session.

## 1. Read the design

`get_design_context` **requires** the Figma design-to-code guidance first. Load
it with `get_figma_skill` on `skill://figma/figma-design-to-code/SKILL.md`, and
pass `skillNames: "resource:figma-design-to-code"` on the call.

- A **section** node returns only sparse metadata. Fetch each variant symbol
  individually — the 1440 / 768 / 375 frames are separate nodes.
- Run `get_variable_defs` too. It names the Figma variables, which is how you
  find the matching CSS token instead of pasting a hex value.
- `download_assets` gives an `export` render of a whole node plus its raw
  images. Exporting a *container* node is how you get a flattened composite.

**Figma files here carry stale placeholder content.** Several variants still
show copy from the template this design was forked from (`globallearninglab.org`,
another business's electrician copy, "lorem lorem"). This project is for
**Impulse Electrical Enterprise (IEE)**, itself an electrical business, so judge
electrician copy by the business name and contact details it carries, not by its
topic. Treat the 1440 frame as authoritative for copy and the others for layout,
and say so when you report.

## 2. Build from what exists

- **Colours, spacing, radii and type already exist** in
  `src/app/style-variables/tokens.css`, generated from the Figma variables by
  `npm run figma:sync`. **Never hand-edit that file** and never introduce a raw
  hex that a token already covers.
- Reuse `StyledContainer` (it already matches the `horizontalpadding`
  variable at every breakpoint), `StyledSectionTitle`, `StyledButton`,
  `ContactForm`, `atd-icons`.
- The designs only have 375 / 768 / 1440 frames and say nothing about the gaps.
  **Desktop layouts start at `lg` (1024)** here, matching the header — not
  `xl`, which leaves 1024–1279 rendering the stacked mobile layout at desktop
  type sizes.

## 3. Model changes

Local model first: `customtypes/<type>/index.json` for document types,
`src/slices/<Slice>/model.json` for slices.

Then **regenerate `prismicio-types.d.ts` by hand** to match, copying the shape
of a neighbouring field exactly — a repeatable Link is
`prismic.Repeatable<prismic.LinkField<...>>`, not a bare `LinkField`. Slice
Machine will produce the same output on its next run.

## 4. Content and assets

- `upload_asset` fetches **server-side from a public HTTPS URL**. A Figma asset
  URL works directly, so images move Figma → Prismic without a third-party
  host. Check `search_assets` first; reuse assets rather than duplicating.
- Content goes in a **release**: `create_release` → writes → `present_release`
  → ask → `publish_release`.
- Publishing is irreversible and **outward-facing. Ask first, every time.**
  Approval on an earlier release does not carry to the next one.
- Only ever touch **`iee-dev`** (Impulse Electrical Enterprise). `atd-prismic-starter`
  is a read-only reference; other repos belong to other projects.

## Hard stops

**Models cannot be pushed over MCP.** Only Slice Machine pushes custom types
and slice models. Write the model locally, then stop and ask the user to push
before you write any content against the new fields — Prismic rejects unknown
paths until it lands.

**Slice screenshots need a second push.** A new variation shows a placeholder
in the editor until `screenshot-<variationId>.png` exists in the slice folder
*and* Slice Machine has been run again. Capture it from the rendered variant at
1440 with the Next dev overlay removed
(`document.querySelectorAll('nextjs-portal').forEach(n => n.remove())`).

## 5. Verify in a real browser

`src/app/layout.tsx` awaits Prismic at **module scope**, so a running dev
server keeps its data for its whole life. **After publishing, restart the dev
server** or you will debug a stale page. Next 16 also refuses to start a second
dev server for the same directory, so restart rather than starting another.

Drive headless Chrome over the DevTools protocol on `--remote-debugging-port`:

- **Measure, do not eyeball.** `getBoundingClientRect`, `getComputedStyle`,
  `scrollWidth` vs `clientWidth`. Report numbers against the design's numbers.
- Check every breakpoint the design defines, and the gaps between them.
- Interactions need **real dispatched input** (`Input.dispatchMouseEvent`). A
  synthetic `mouseenter` never reaches React's delegated handlers.
- Scope selectors to the component under test. The desktop nav is still in the
  DOM while hidden, and clicking its zero-size elements silently does nothing.

### Two that will mislead you

- **Tailwind v4 emits `rotate` and `translate` as standalone properties.**
  `getComputedStyle(el).transform` reads `none` on a working transform — read
  `.rotate` / `.translate`.
- **`drop-shadow-*` is a CSS `filter`**, and a filtered element becomes the
  containing block for `position: fixed` descendants. Use `shadow-*` on
  anything that contains a fixed overlay.

## 6. Finish

1. `tsc --noEmit` and `eslint` on what you touched. Distinguish **pre-existing**
   failures from ones you caused — check the committed version with
   `git show HEAD:<path>` before claiming either.
2. **Stop every process you started** — dev server (1204), Slice Machine
   (1203), debug Chrome (9222).
3. Record the work with the **`update-progress`** skill.

## Working notes

- Temp files, scripts and screenshots go in the scratchpad directory, never the
  repo.
- Bash heredocs here mangle backslash escapes: `\n` inside a generated string
  becomes a real newline and breaks the file. **Write patch scripts to a file
  and run them with node**, and build escapes with `String.fromCharCode(92)`
  when you must.
- Patch scripts should assert an exact match count before replacing, and exit
  non-zero otherwise — a silent zero-match edit is the failure mode here.
