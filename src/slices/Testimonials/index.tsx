import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import dynamic from "next/dynamic";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";

const ManualEntries = dynamic(() => import("./variations/ManualEntries"));
const GoogleReviews = dynamic(() => import("./variations/GoogleReviews"));
const RatedCards = dynamic(() => import("./variations/RatedCards"));
const VideoTestimonials = dynamic(
  () => import("./variations/VideoTestimonials"),
);

/**
 * Props for `Testimonials`.
 */
export type TestimonialsProps = SliceComponentProps<Content.TestimonialsSlice>;

/**
 * Component for "Testimonials" Slices.
 */
const paddingXStyles = "px-[16px] md:px-[40px] xl:px-[80px]";

const Testimonials: FC<TestimonialsProps> = ({ slice }) => {
  const isRatedCards = slice.variation === "ratedCards";

  // Full-bleed split layout with no section header
  if (slice.variation === "videoTestimonials") {
    return <VideoTestimonials slice={slice} />;
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer slice={slice} paddingX={!isRatedCards}>
        {isRatedCards ? (
          <div className={paddingXStyles}>
            <StyledSectionTitle slice={slice} />
          </div>
        ) : (
          <StyledSectionTitle slice={slice} />
        )}
        {slice.variation === "default" && <ManualEntries slice={slice} />}
        {slice.variation === "googleReviews" && <GoogleReviews slice={slice} />}
        {isRatedCards && <RatedCards slice={slice} />}
      </StyledContainer>
    </section>
  );
};

export default Testimonials;
