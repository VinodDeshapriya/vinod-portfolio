import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle, {
  isEmptyTitleSection,
} from "@/components/ui/StyledSectionTitle";
import clsx from "clsx";
import LargeNumber from "./components/LargeNumber";
import SmallNumber from "./components/SmallNumber";
import Icon from "./components/Icon";
import Image from "./components/Image";
import Card from "./components/Card";
import Steps from "./components/Steps";
import CardCarouselCard from "./components/CardCarouselCard";
import FeaturedContentCarousel from "./components/Carousel";

/**
 * Props for `FeaturedContent`.
 */
export type FeaturedContentProps =
  SliceComponentProps<Content.FeaturedContentSlice>;

const VARIATION_COMPONENTS = {
  default: LargeNumber,
  smallNumbers: SmallNumber,
  icons: Icon,
  images: Image,
  grid: Card,
  defaultCarousel: LargeNumber,
  smallNumbersCarousel: SmallNumber,
  iconsCarousel: Icon,
  imagesCarousel: Image,
  cardCarousel: CardCarouselCard,
} as const;

const CAROUSEL_VARIATIONS: ReadonlySet<string> = new Set([
  "defaultCarousel",
  "smallNumbersCarousel",
  "iconsCarousel",
  "imagesCarousel",
  "cardCarousel",
]);

/**
 * Component for "FeaturedContent" Slices.
 */
const FeaturedContent: FC<FeaturedContentProps> = ({ slice }) => {
  const isSteps = slice.variation === "steps";
  const isCardCarousel = slice.variation === "cardCarousel";
  const ItemComponent =
    VARIATION_COMPONENTS[slice.variation as keyof typeof VARIATION_COMPONENTS];
  const isGrid = slice.variation === "grid";
  const isCarousel =
    CAROUSEL_VARIATIONS.has(slice.variation) ||
    (isGrid && slice.primary.layout === "Carousel");

  const featuresCount = slice?.primary?.features?.length;
  const paddingXStyles = "px-[16px] md:px-[40px] xl:px-[80px]";
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer slice={slice} paddingX={false}>
        <div className={paddingXStyles}>
          <StyledSectionTitle slice={slice} />
        </div>

        <div
          className={clsx({
            "mt-8 lg:mt-12": !isEmptyTitleSection(slice),
          })}
        >
          {isSteps ? (
            <div className={paddingXStyles}>
              <Steps features={slice.primary.features} />
            </div>
          ) : isCarousel ? (
            <FeaturedContentCarousel
              slides={(slice?.primary?.features ?? []).map((item, idx) => (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <ItemComponent
                  key={idx}
                  item={item as any}
                  index={idx + 1}
                  hasBg={!slice?.primary?.background_color}
                />
              ))}
              loop={!isCardCarousel}
              showDots={isCardCarousel}
              className={clsx({ "is-card-carousel": isCardCarousel })}
            />
          ) : (
            <div className={paddingXStyles}>
              <div className={clsx("grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 justify-center gap-5", { "auto-rows-fr": !isGrid })}>
                {slice?.primary?.features?.map((item, idx) => (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <div
                    key={idx}
                    className={clsx({
                      "md:col-span-2": true,
                      "md:col-start-2 lg:col-start-auto":
                        featuresCount % 2 === 1 && idx === featuresCount - 1,
                      "lg:col-start-3":
                        featuresCount % 3 === 1 && idx === featuresCount - 1,
                      "lg:col-start-2":
                        featuresCount % 3 === 2 && idx === featuresCount - 2,
                      // grid cards share row heights with their neighbours (see Card `subgrid`)
                      "row-span-4 grid grid-rows-subgrid gap-0": isGrid,
                    })}
                  >
                    {isGrid ? (
                      <Card
                        item={item as Content.FeaturedContentSliceGrid["primary"]["features"][number]}
                        subgrid
                      />
                    ) : (
                      <ItemComponent
                        item={item as any}
                        index={idx + 1}
                        hasBg={!slice?.primary?.background_color}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </StyledContainer>
    </section>
  );
};

export default FeaturedContent;
