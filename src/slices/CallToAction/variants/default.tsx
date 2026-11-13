import { Content } from "@prismicio/client";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";

type Props = {
  slice: Extract<Content.CTASlice, { variation: "default" }>;
};

const Default = ({ slice }: Props) => (
  <StyledContainer slice={slice}>
    <StyledSectionTitle slice={slice} />
  </StyledContainer>
);

export default Default;
