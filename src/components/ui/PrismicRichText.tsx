/**
 * RichText
 *
 * Opinionated wrapper around `<PrismicRichText>` that applies the project's
 * design-system typography tokens to every block type out of the box.
 *
 * ## Default styles
 * - Headings h1–h6 use the `text-title-*` scale with consistent top/bottom
 *   margins that collapse at the first/last child.
 * - Paragraphs, ordered/unordered lists, and preformatted blocks are all
 *   spaced and indented to match the design spec.
 * - Hyperlinks are rendered via `<PrismicNextLink>` with underline styling.
 *
 * ## Customizing components
 * Pass a partial `components` map to override individual block renderers.
 * Your overrides are merged on top of the defaults, so you only need to
 * specify the blocks you want to change.
 *
 */
import { PrismicNextLink } from "@prismicio/next";
import {
  RichTextComponents,
  PrismicRichText as BasePrismicRichText,
} from "@prismicio/react";
import { asText, RichTextField } from "@prismicio/client";

interface StyledPrismicRichTextProps {
  components?: RichTextComponents;
  parentClassName?: string;
  field: RichTextField | undefined;
}

export default function PrismicRichText({
  components,
  parentClassName,
  field,
  ...props
}: StyledPrismicRichTextProps) {
  if (!asText(field)) return null;

  if (parentClassName) {
    return (
      <div className={parentClassName}>
        <BasePrismicRichText
          components={{ ...defaultComponents, ...components }}
          field={field}
          {...props}
        />
      </div>
    );
  }
  return (
    <BasePrismicRichText
      field={field}
      components={{ ...defaultComponents, ...components }}
      {...props}
    />
  );
}

const defaultComponents: RichTextComponents = {
  heading1: ({ children }) => (
    <h1 className="text-title-3x-large mt-12 mb-7 first:mt-0 last:mb-0">
      {children}
    </h1>
  ),
  heading2: ({ children }) => (
    <h2 className="text-title-2x-large mt-12 mb-7 first:mt-0 last:mb-0">
      {children}
    </h2>
  ),
  heading3: ({ children }) => (
    <h3 className="text-title-x-large mt-12 mb-7 first:mt-0 last:mb-0">
      {children}
    </h3>
  ),
  heading4: ({ children }) => (
    <h4 className="text-title-large mt-12 mb-7 first:mt-0 last:mb-0">
      {children}
    </h4>
  ),
  heading5: ({ children }) => (
    <h5 className="text-title-medium mt-12 mb-7 first:mt-0 last:mb-0">
      {children}
    </h5>
  ),
  heading6: ({ children }) => (
    <h6 className="text-title-base mb-5">{children}</h6>
  ),
  paragraph: ({ children }) => (
    <p className="text-body-medium mb-7 last:mb-0">{children}</p>
  ),
  oList: ({ children }) => (
    <ol className="text-body-medium pl-4 mb-7 last:mb-0 md:pl-6">{children}</ol>
  ),
  oListItem: ({ children }) => (
    <li className="text-body-medium pl-1 mb-1 list-decimal last:mb-0 md:pl-2">
      {children}
    </li>
  ),
  list: ({ children }) => (
    <ul className="text-body-medium pl-4 mb-7 last:mb-0 md:pl-6">{children}</ul>
  ),
  listItem: ({ children }) => (
    <li className="text-body-medium pl-1 mb-1 list-disc last:mb-0 md:pl-2">
      {children}
    </li>
  ),
  preformatted: ({ children }) => (
    <pre className="p-4 text-sm rounded-sm mb-7 bg-slate-100 last:mb-0 md:p-8 md:text-lg">
      <code>{children}</code>
    </pre>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  hyperlink: ({ children, node }) => (
    <PrismicNextLink
      field={node.data}
      className="underline decoration-1 underline-offset-2"
    >
      {children}
    </PrismicNextLink>
  ),
};
