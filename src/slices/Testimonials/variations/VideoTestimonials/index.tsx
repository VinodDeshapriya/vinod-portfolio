import { Content, isFilled } from "@prismicio/client";
import clsx from "clsx";
import { PrismicNextImage } from "@prismicio/next";
import { Image as ImageIcon } from "atd-icons";
import StyledContainer from "@/components/ui/StyledContainer";
import VideoTestimonialsSlider, {
  type VideoTestimonialSlide,
} from "../components/VideoTestimonialsSlider";
import TestimonialVideo from "../components/TestimonialVideo";

type VideoTestimonialsProps = {
  slice: Extract<Content.TestimonialsSlice, { variation: "videoTestimonials" }>;
};

/**
 * "Video Testimonials" variation: one testimonial at a time, each with an
 * image that can open a YouTube/Vimeo video in a popup.
 */
export default function VideoTestimonials({ slice }: VideoTestimonialsProps) {
  const slides: VideoTestimonialSlide[] = slice.primary.testimonials.map(
    (item, index) => ({
      text: (
        <div key={`text-${index}`} className="flex flex-col gap-4">
          {item.quote && (
            <p className="text-title-x-large text-text-heading">
              &ldquo;{item.quote}&rdquo;
            </p>
          )}
          {item.testimonial && (
            <p className="text-body-base text-text-description">
              {item.testimonial}
            </p>
          )}
          {(item.name || item.role) && (
            <div className="flex items-center justify-center gap-3 pt-2 md:pt-0 lg:justify-start">
              {isFilled.image(item.avatar) && (
                // rounded-[50%], not rounded-full: the --radius-full token is 6px
                <PrismicNextImage
                  field={item.avatar}
                  fallbackAlt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-[50%] object-cover"
                />
              )}
              <div className="flex flex-col items-start text-left md:flex-row md:items-center md:gap-3">
                {item.name && (
                  <span className="text-body-medium text-text-heading">
                    {item.name}
                  </span>
                )}
                {item.name && item.role && (
                  <span
                    aria-hidden
                    className="hidden h-px w-7 bg-text-description md:block"
                  />
                )}
                {item.role && (
                  <>
                    {/* Figma body/xsmall under the name on mobile, inline at md+ */}
                    <span className="text-label font-normal! text-text-placeholder md:hidden">
                      {item.role}
                    </span>
                    <span className="hidden text-body-medium text-text-placeholder md:inline">
                      {item.role}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ),
      media: (
        <div
          key={`media-${index}`}
          className="relative aspect-738/645 overflow-hidden rounded-(--radius-md) bg-offwhite-2"
        >
          {isFilled.image(item.image) ? (
            <PrismicNextImage
              field={item.image}
              fallbackAlt=""
              fill
              sizes="(max-width: 1024px) 100vw, 738px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon size={32} className="text-text-inactive" />
            </div>
          )}
          {isFilled.embed(item.video) && <TestimonialVideo embed={item.video} />}
        </div>
      ),
    }),
  );

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer
        slice={slice}
        // Figma video-testimonial at 1440: 811px tall, the 645px video 83px from
        // top and bottom (the "Full" token would give 120px each side)
        parentClassName={clsx("relative overflow-hidden bg-offwhite lg:bg-white", {
          "xl:pt-[83px]": slice.primary.top_padding === "Full",
          "xl:pb-[83px]": slice.primary.bottom_padding === "Full",
        })}
        className="relative"
      >
        {/* Desktop: offwhite panel from the viewport edge to 86px under the video */}
        <div
          aria-hidden
          className="absolute -inset-y-100 -left-[100vw] right-[calc(57.66%-86px)] hidden bg-offwhite lg:block"
        />
        {slides.length > 0 && (
          <div className="relative">
            <VideoTestimonialsSlider slides={slides} />
          </div>
        )}
      </StyledContainer>
    </section>
  );
}
