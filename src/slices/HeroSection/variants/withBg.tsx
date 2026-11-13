import { Content, KeyTextField } from "@prismicio/client";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";
import { PrismicNextImage } from "@prismicio/next";
import GoogleReviewsBadge from "../components/GoogleReviewsBadge";
import fetchGoogleReviews from "../components/fetchGoogleReviews";

type Props = {
  slice: Extract<
    Content.HeroSectionSlice,
    { variation: "withBackgroundImage" }
  >;
  clientId?: KeyTextField;
};

const WithBg = async ({ slice, clientId }: Props) => {
  const { reviewScore, totalReviewsCount } =
    slice.primary.show_google_reviews && clientId
      ? await fetchGoogleReviews(clientId)
      : {};

  return (
    <section className="relative flex flex-col pb-10 md:pb-[150px] xl:pb-[196px] justify-end min-h-[850px] md:min-h-[950px] xl:min-h-[800px] items-center overflow-hidden md:min-h-160 max-w-[1800px] mx-auto">
      <PrismicNextImage
        field={slice?.primary?.image}
        fallbackAlt=""
        fill
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/40 to-black/10 md:bg-linear-to-r md:from-black/80 md:via-black/40 md:to-transparent" />
      <div className="px-4 md:px-10 xl:px-20 max-w-[1440px] w-full mx-auto">
        <div className="xl:max-w-[762px]">
          <StyledSectionTitle
            slice={slice}
            isHero
            leftAlign="xl"
            invertedColors
          />
        </div>
        <GoogleReviewsBadge
          reviewScore={reviewScore}
          totalReviewsCount={totalReviewsCount}
          alignFrom="xl"
          invertedColors
        />
      </div>
    </section>
  );
};

export default WithBg;
