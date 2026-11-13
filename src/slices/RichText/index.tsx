import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import NormalizedRichText from "@/components/ui/PrismicRichTextNormalized";
import PrismicRichText from "@/components/ui/PrismicRichText";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";
import clsx from "clsx";

/**
 * Props for `RichText`.
 */
export type RichTextProps = SliceComponentProps<Content.RichTextSlice>;

/**
 * Component for "RichText" Slices.
 */
const RichText: FC<RichTextProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer slice={slice}>
        <div
          className={clsx({
            "flex flex-col gap-(--spacing-space-1)": true,
          })}
        >
          <StyledSectionTitle
            slice={slice}
            leftAlign={slice.primary.title_alignment === "Left"}
          />
          <PrismicRichText
            field={slice?.primary?.content}
            parentClassName={clsx({
              "w-full max-w-260 mx-auto": true,
              "text-center": slice.primary.content_alignment === "Center",
            })}
          />
        </div>
      </StyledContainer>
    </section>
  );
};

export default RichText;
