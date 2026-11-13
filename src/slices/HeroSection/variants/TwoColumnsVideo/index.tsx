import { Content, isFilled, KeyTextField } from "@prismicio/client";
import clsx from "clsx";
import { PrismicNextImage } from "@prismicio/next";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";
import StyledButtonGroup from "@/components/ui/StyledButtonGroup";
import PrismicRichText from "@/components/ui/PrismicRichText";
import GoogleReviewsBadge from "../../components/GoogleReviewsBadge";
import fetchGoogleReviews from "../../components/fetchGoogleReviews";
import HeroVideo from "../../components/HeroVideo";

type Props = {
  slice: Extract<Content.HeroSectionSlice, { variation: "twoColumnsVideo" }>;
  clientId?: KeyTextField;
};

/**
 * Two-column hero with an icon list of highlights and a 4:5 image that can
 * open a video. Goes two-column at lg; below that everything is centred and
 * the image drops underneath.
 */
const TwoColumnsVideo = async ({ slice, clientId }: Props) => {
  const { reviewScore, totalReviewsCount } =
    slice.primary.show_google_reviews && clientId
      ? await fetchGoogleReviews(clientId)
      : {};

  const { highlights, buttons, image, video } = slice.primary;

  return (
    <StyledContainer
      slice={slice}
      // Figma hero_variants5 at 1440: 30px above and below, not the 60px "Half" token
      parentClassName={clsx({
        "xl:pt-7.5": slice.primary.top_padding === "Half",
        "xl:pb-7.5": slice.primary.bottom_padding === "Half",
      })}
    >
      <div className="grid grid-cols-1 items-center gap-(--spacing-space-1) lg:grid-cols-2">
        <div>
          {/* StyledSectionTitle only left-aligns from md or xl; this layout goes two-column at lg */}
          <div className="lg:[&>div]:mx-0 lg:[&>div]:text-left">
            <StyledSectionTitle
              slice={{
                primary: {
                  eyebrow: slice.primary.eyebrow,
                  title: slice.primary.title,
                  description: slice.primary.description,
                },
              }}
              isHero
            />
          </div>

          {highlights.length > 0 && (
            <ul className="mx-auto mt-3 flex w-fit flex-col gap-1 text-left lg:mx-0">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-center gap-4 py-1">
                  {isFilled.image(item.icon) && (
                    <PrismicNextImage
                      field={item.icon}
                      fallbackAlt=""
                      width={32}
                      height={32}
                      className="size-8 shrink-0 object-contain"
                    />
                  )}
                  <PrismicRichText
                    field={item.text}
                    components={{
                      paragraph: ({ children }) => (
                        <p className="text-body-base text-text-heading">
                          {children}
                        </p>
                      ),
                    }}
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="md:[&>div]:mx-auto lg:[&>div]:mx-0 lg:[&>div]:justify-start">
            <StyledButtonGroup
              slice={{ primary: { buttons } }}
              className="mt-10"
            />
          </div>

          <div className="pt-4">
            <GoogleReviewsBadge
              reviewScore={reviewScore}
              totalReviewsCount={totalReviewsCount}
              alignFrom="lg"
            />
          </div>
        </div>

        <div className="relative mx-auto aspect-4/5 w-full max-w-149 overflow-hidden rounded-(--radius-md)">
          <PrismicNextImage
            field={image}
            fallbackAlt=""
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover"
          />
          {isFilled.embed(video) && <HeroVideo embed={video} />}
        </div>
      </div>
    </StyledContainer>
  );
};

export default TwoColumnsVideo;
