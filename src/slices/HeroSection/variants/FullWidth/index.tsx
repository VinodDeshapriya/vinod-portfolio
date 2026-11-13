import { Content } from "@prismicio/client";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";
import HeroImage from "../../components/HeroImage";

type Props = {
  slice: Extract<Content.HeroSectionSlice, { variation: "default" }>;
};

const FullWidth = ({ slice }: Props) => {
  const hasBottomPadding = (slice.primary.bottom_padding ?? "None") !== "None";

  return (
    <StyledContainer slice={slice}>
      <div className="grid gap-(--spacing-space-1) grid-cols-1">
        <div>
          <StyledSectionTitle slice={slice} isHero />
        </div>
        <div className="w-full max-w-266 mx-auto">
          <HeroImage
            image={slice.primary.image}
            aspect="video"
            sizes="(max-width: 1200px) 100vw, 1080px"
            roundBottom={hasBottomPadding}
          />
        </div>
      </div>
    </StyledContainer>
  );
};

export default FullWidth;
