import { FC } from "react";
import { asText, Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import slugify from "slugify";
import PrismicRichTextNormalized from "@/components/ui/PrismicRichTextNormalized";
import PrismicRichText from "@/components/ui/PrismicRichText";
import { PrismicNextLink } from "@prismicio/next";
import StyledContainer from "@/components/ui/StyledContainer";

/**
 * Props for `TextBlock`.
 */
export type TextBlockProps = SliceComponentProps<Content.TextBlockSlice>;

/**
 * Component for "TextBlock" Slices.
 */
const TextBlock: FC<TextBlockProps> = ({ slice }) => {
  const { title, content } = slice.primary;

  return (
    <section
      id={slugify(asText(title), { lower: true, strict: true })}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer
        slice={slice}
        className="max-w-[846px]!"
        paddingX={false}
      >
        <PrismicRichTextNormalized
          field={title}
          className="inline-block mt-5 mb-3 text-title-medium"
        />
        <PrismicRichText
          field={content}
          components={{
            heading3: ({ children, node }) => (
              <h3
                id={slugify(node.text, { lower: true, strict: true })}
                className="text-title-base mt-5 mb-3"
              >
                {children}
              </h3>
            ),
            heading4: ({ children, node }) => (
              <h4
                id={slugify(node.text, { lower: true, strict: true })}
                className="text-title-base-blog mt-5 mb-3"
              >
                {children}
              </h4>
            ),
            paragraph: ({ children }) => (
              <p className="text-body-base mb-3 last:mb-0">{children}</p>
            ),
            hyperlink: ({ children, node }) => (
              <PrismicNextLink
                field={node.data}
                className="underline decoration-1 underline-offset-2 text-info-primary hover:text-[color-mix(in_srgb,var(--color-info-primary)_80%,black)]"
              >
                {children}
              </PrismicNextLink>
            ),
          }}
        />
      </StyledContainer>
    </section>
  );
};

export default TextBlock;
