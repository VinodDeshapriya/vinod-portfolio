import { Content, KeyTextField } from "@prismicio/client";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";
import HeroImage from "../../components/HeroImage";
import GoogleReviewsBadge from "../../components/GoogleReviewsBadge";
import fetchGoogleReviews from "../../components/fetchGoogleReviews";

type Props = {
  slice: Extract<Content.HeroSectionSlice, { variation: "twoColumns" }>;
  clientId?: KeyTextField;
};

const TwoColumns = async ({ slice, clientId }: Props) => {
  const { reviewScore, totalReviewsCount } =
    slice.primary.show_google_reviews && clientId
      ? await fetchGoogleReviews(clientId)
      : {};

  return (
    <StyledContainer slice={slice}>
      <div className="grid gap-(--spacing-space-1) grid-cols-1 xl:grid-cols-2 items-center">
        <div>
          <StyledSectionTitle slice={slice} isHero leftAlign="xl" />
          <GoogleReviewsBadge
            reviewScore={reviewScore}
            totalReviewsCount={totalReviewsCount}
            alignFrom="xl"
          />
        </div>
        <div className="w-full max-w-266 mx-auto self-start sticky top-0">
          <HeroImage
            image={slice.primary.image}
            aspect="square"
            sizes="(max-width: 640px) 100vw, 960px"
          />
        </div>
      </div>
    </StyledContainer>
  );
};

export default TwoColumns;
