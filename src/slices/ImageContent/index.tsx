import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { PrismicNextImage } from "@prismicio/next";

const ImageSteps = dynamic(() => import("./variants/ImageSteps"));
const LocationList = dynamic(() => import("./variants/LocationList"));

/**
 * Props for `ImageContent`.
 */
export type ImageContentProps = SliceComponentProps<Content.ImageContentSlice>;

/**
 * Component for "ImageContent" Slices.
 */
const ImageContent: FC<ImageContentProps> = ({ slice }) => {
  if (slice.variation === "imageSteps") {
    return <ImageSteps slice={slice} />;
  }

  if (slice.variation === "locationList") {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
      >
        <LocationList slice={slice} />
      </section>
    );
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer slice={slice}>
        <div
          className={clsx({
            "grid gap-(--spacing-space-1)": true,
            "grid-cols-1 md:grid-cols-2 items-center": true,
          })}
        >
          <div className={clsx({ "md:order-2": !slice.primary.image_right })}>
            <StyledSectionTitle slice={slice} leftAlign={"md"} />
          </div>
          <div
            className={clsx("w-full max-w-266 mx-auto", {
              "self-start md:sticky md:top-0": true,
            })}
          >
            <div
              className={clsx({
                "relative overflow-hidden rounded-(--radius-md)": true,
                "aspect-square": true,
              })}
            >
              <PrismicNextImage
                field={slice?.primary?.image}
                fallbackAlt=""
                fill
                sizes={"(max-width: 640px) 100vw, 960px"}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </StyledContainer>
    </section>
  );
};

export default ImageContent;
