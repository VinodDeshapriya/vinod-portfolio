import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";

/**
 * Props for `TextContent`.
 */
export type TextContentProps = SliceComponentProps<Content.TextContentSlice>;

/**
 * Component for "TextContent" Slices.
 */
const TextContent: FC<TextContentProps> = ({ slice }) => {
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

export default TextContent;
