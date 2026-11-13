#!/usr/bin/env node
/**
 * Creates a new Prismic slice scaffolded from the RichText template.
 *
 * Run: npm run slice:create
 */

import { createInterface } from "readline";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { pascalCase, snakeCase } from "change-case";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Read current button variants from buttonTypes.ts ──────────────────────────

const buttonTypesSource = readFileSync(
  join(ROOT, "src/lib/buttonTypes.ts"),
  "utf8",
);
const arrayMatch = buttonTypesSource.match(
  /BUTTON_VARIANTS\s*=\s*\[([\s\S]*?)\]\s*as const/,
);
const buttonVariants = arrayMatch
  ? [...arrayMatch[1].matchAll(/variant:\s*["']([^"']+)["']/g)].map((m) => m[1])
  : ["Primary", "Secondary"];

// ── Prompt ────────────────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout });

rl.question("Slice name: ", (input) => {
  rl.close();

  const raw = input.trim();
  if (!raw) {
    console.error("❌  No name provided.");
    process.exit(1);
  }

  const name = pascalCase(raw);
  const id = snakeCase(raw);
  const sliceDir = join(ROOT, "src/slices", name);

  if (existsSync(sliceDir)) {
    console.error(`❌  Slice "${name}" already exists at src/slices/${name}`);
    process.exit(1);
  }

  // ── model.json ──────────────────────────────────────────────────────────────

  const model = {
    id,
    type: "SharedSlice",
    name,
    description: name,
    variations: [
      {
        id: "default",
        name: "Default",
        docURL: "...",
        version: "initial",
        description: "Default",
        imageUrl: "",
        primary: {
          top_padding: {
            type: "Select",
            config: {
              label: "Top Padding",
              placeholder: "",
              options: ["Full", "Half", "None"],
              default_value: "Full",
            },
          },
          bottom_padding: {
            type: "Select",
            config: {
              label: "Bottom Padding",
              placeholder: "",
              options: ["Full", "Half", "None"],
              default_value: "Full",
            },
          },
          background_color: {
            type: "Boolean",
            config: {
              label: "Background Color?",
              placeholder_false: "No",
              placeholder_true: "Yes",
              default_value: false,
            },
          },
          eyebrow: {
            type: "StructuredText",
            config: {
              label: "Eyebrow",
              placeholder: "",
              allowTargetBlank: false,
              multi: "paragraph,heading2,heading3",
            },
          },
          title: {
            type: "StructuredText",
            config: {
              label: "Title",
              placeholder: "",
              allowTargetBlank: false,
              single: "paragraph,heading2,heading3",
            },
          },
          description: {
            type: "StructuredText",
            config: {
              label: "Description",
              placeholder: "",
              allowTargetBlank: true,
              multi: "paragraph,strong,em,hyperlink",
            },
          },
          buttons: {
            type: "Link",
            config: {
              label: "Buttons",
              placeholder: "",
              select: null,
              allowTargetBlank: true,
              allowText: true,
              repeat: true,
              variants: buttonVariants,
            },
          },
        },
        items: {},
      },
    ],
  };

  // ── mocks.json ───────────────────────────────────────────────────────────────

  const mocks = [
    {
      __TYPE__: "SharedSliceContent",
      variation: "default",
      primary: {
        top_padding: {
          __TYPE__: "FieldContent",
          type: "Select",
          value: "Half",
        },
        bottom_padding: {
          __TYPE__: "FieldContent",
          type: "Select",
          value: "Half",
        },
        background_color: { __TYPE__: "BooleanContent", value: false },
        eyebrow: {
          __TYPE__: "StructuredTextContent",
          value: [
            {
              type: "paragraph",
              content: { text: "Lorem ipsum eyebrow", spans: [] },
              direction: "ltr",
            },
          ],
        },
        title: {
          __TYPE__: "StructuredTextContent",
          value: [
            {
              type: "paragraph",
              content: { text: "Lorem Title", spans: [] },
              direction: "ltr",
            },
          ],
        },
        description: {
          __TYPE__: "StructuredTextContent",
          value: [
            {
              type: "paragraph",
              content: {
                text: "Aliqua incididunt qui consectetur consequat eiusmod sit amet incididunt consequat exercitation excepteur fugiat.",
                spans: [],
              },
              direction: "ltr",
            },
          ],
        },
        buttons: {
          __TYPE__: "RepeatableContent",
          type: "Link",
          value: [
            {
              key: randomUUID(),
              __TYPE__: "LinkContent",
              value: {
                __TYPE__: "ExternalLink",
                url: "https://example.com",
                target: "_blank",
                text: "Get started",
                variant: "Primary",
              },
            },
          ],
        },
      },
      items: [],
    },
  ];

  // ── index.tsx ────────────────────────────────────────────────────────────────

  const component = `import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";

/**
 * Props for \`${name}\`.
 */
export type ${name}Props = SliceComponentProps<Content.${name}Slice>;

/**
 * Component for "${name}" Slices.
 */
const ${name}: FC<${name}Props> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer slice={slice}>
        <StyledSectionTitle slice={slice} />
      </StyledContainer>
    </section>
  );
};

export default ${name};
`;

  // ── Write files ──────────────────────────────────────────────────────────────

  mkdirSync(sliceDir, { recursive: true });
  writeFileSync(
    join(sliceDir, "model.json"),
    JSON.stringify(model, null, 2) + "\n",
  );
  writeFileSync(
    join(sliceDir, "mocks.json"),
    JSON.stringify(mocks, null, "\t") + "\n",
  );
  writeFileSync(join(sliceDir, "index.tsx"), component);

  // ── Update src/slices/index.ts (sorted alphabetically) ──────────────────────

  const indexPath = join(ROOT, "src/slices/index.ts");
  const indexContent = readFileSync(indexPath, "utf8");

  const indexMatch = indexContent.match(
    /^([\s\S]*?export const components = \{)([\s\S]*?)(\};[\s]*)$/,
  );
  if (!indexMatch) {
    console.error("❌  Could not parse src/slices/index.ts");
    process.exit(1);
  }

  const [, before, body, after] = indexMatch;
  const entries = body
    .split("\n")
    .filter((l) => l.trim())
    .concat(`  ${id}: dynamic(() => import("./${name}")),`);

  entries.sort((a, b) => a.trim().localeCompare(b.trim()));

  writeFileSync(indexPath, `${before}\n${entries.join("\n")}\n${after}`);

  console.log(`\n✅  Created slice "${name}"`);
  console.log(`   src/slices/${name}/model.json`);
  console.log(`   src/slices/${name}/mocks.json`);
  console.log(`   src/slices/${name}/index.tsx`);
  console.log(`   Updated src/slices/index.ts`);
  console.log(`\n→  Next: sync in Slice Machine at http://localhost:1203`);
});
