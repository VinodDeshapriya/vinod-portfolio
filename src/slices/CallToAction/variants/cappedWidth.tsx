import { Content } from "@prismicio/client";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";

type Props = {
  slice: Extract<Content.CTASlice, { variation: "cappedWidth" }>;
};

const CappedWidth = ({ slice }: Props) => (
  <StyledContainer slice={slice}>
    <section className="bg-primary-dark py-10 md:py-15 xl:py-20 px-4 md:px-6 xl:px-30 rounded-lg mx-auto">
      <StyledSectionTitle slice={slice} invertedColors />
    </section>
  </StyledContainer>
);

export default CappedWidth;
