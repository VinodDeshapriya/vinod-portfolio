/**
 * NormalizedRichText
 *
 * Renders a Prismic rich text field where every block element (headings and
 * paragraphs) shares a single `className`. Use this when you need uniform
 * typography across all block types — e.g. a card title that can be authored
 * as any heading level without changing its visual style.
 *
 * Returns `null` when the field is empty, so no wrapper markup is emitted.
 *
 * @example
 * <NormalizedRichText field={slice.primary.title} className="text-2xl font-bold" />
 */
import { PrismicRichText } from "@prismicio/react";
import { asText, RichTextField } from "@prismicio/client";

interface Props {
  field: RichTextField | undefined;
  className?: string;
}

const PrismicRichTextNormalized = ({ field, className }: Props) => {
  if (!asText(field)) return null;
  return (
    <PrismicRichText
      field={field}
      components={{
        heading1: ({ children }) => <h1 className={className}>{children}</h1>,
        heading2: ({ children }) => <h2 className={className}>{children}</h2>,
        heading3: ({ children }) => <h3 className={className}>{children}</h3>,
        heading4: ({ children }) => <h4 className={className}>{children}</h4>,
        heading5: ({ children }) => <h5 className={className}>{children}</h5>,
        heading6: ({ children }) => <h6 className={className}>{children}</h6>,
        paragraph: ({ children }) => <p className={className}>{children}</p>,
      }}
    />
  );
};

export default PrismicRichTextNormalized;
