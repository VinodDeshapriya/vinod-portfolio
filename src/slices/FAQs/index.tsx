import { FC } from "react";
import * as prismic from "@prismicio/client";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";
import QuestionBlocks from "./components/QuestionBlocks";
import clsx from "clsx";

/**
 * Props for `FaQs`.
 */
export type FaQsProps = SliceComponentProps<Content.FAQsSlice>;

/**
 * Component for "FaQs" Slices.
 */
const FaQs: FC<FaQsProps> = ({ slice }: FaQsProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: slice.primary.faqs.map((question) => ({
      "@type": "Question",
      name: prismic.asText(question.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: prismic.asText(question.answer),
      },
    })),
  };

  const variation = slice.variation;

  const twoColumns = variation === "twoColumns";
  const fullWidth = variation === "default";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <StyledContainer slice={slice}>
        <div
          className={clsx({
            "grid gap-(--spacing-space-1)": true,
            "grid-cols-1 lg:grid-cols-2": twoColumns,
            "grid-cols-1 max-w-212 mx-auto": fullWidth,
          })}
        >
          <StyledSectionTitle slice={slice} leftAlign={twoColumns} />
          <QuestionBlocks
            list={slice?.primary?.faqs}
            sliceId={slice.id}
            sectionHasBackground={Boolean(slice.primary.background_color)}
          />
        </div>
      </StyledContainer>
    </section>
  );
};

export default FaQs;
