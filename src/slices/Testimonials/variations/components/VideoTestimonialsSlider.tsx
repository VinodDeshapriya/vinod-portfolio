"use client";

import { ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import clsx from "clsx";
import { ArrowForward } from "atd-icons";
import { useDotButton } from "@/components/ui/carousel/EmblaCarouselDotButton";
import { usePrevNextButtons } from "@/components/ui/carousel/EmblaCarouselArrowButtons";

const options = { loop: true };

export interface VideoTestimonialSlide {
  text: ReactNode;
  media: ReactNode;
}

interface VideoTestimonialsSliderProps {
  slides: VideoTestimonialSlide[];
}

/**
 * One testimonial per slide: text + media side by side from lg, stacked
 * (media first) below. The controls (prev arrow, dots, next arrow) live inside
 * each slide, under that slide's text: left-aligned on desktop, centred below.
 */
const VideoTestimonialsSlider = ({ slides }: VideoTestimonialsSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const { selectedIndex, onDotButtonClick } = useDotButton(emblaApi);
  const { onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);
  const hasControls = slides.length > 1;

  const dots = (
    <div className="flex items-center justify-center gap-1.5">
      {slides.map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to testimonial ${index + 1}`}
          aria-current={index === selectedIndex}
          onClick={() => onDotButtonClick(index)}
          className={clsx(
            "h-3 cursor-pointer rounded-[6px] transition-all duration-300",
            index === selectedIndex
              ? "w-9 bg-primary-light"
              : "w-3 bg-text-inactive",
          )}
        />
      ))}
    </div>
  );

  // rounded-[50%], not rounded-full: the --radius-full token is 6px
  const controls = (
    <div className="flex items-center justify-center gap-4 md:gap-6 lg:justify-start">
      <button
        type="button"
        aria-label="Previous testimonial"
        onClick={onPrevButtonClick}
        className="flex size-15 cursor-pointer items-center justify-center rounded-[50%] border-[0.8px] border-text-description text-text-heading"
      >
        <ArrowForward size={28} className="-scale-x-100" />
      </button>
      {dots}
      <button
        type="button"
        aria-label="Next testimonial"
        onClick={onNextButtonClick}
        className="flex size-15 cursor-pointer items-center justify-center rounded-[50%] bg-[#322F2A] text-white"
      >
        <ArrowForward size={28} />
      </button>
    </div>
  );

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex touch-pan-y touch-pinch-zoom">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-0 flex-[0_0_100%]"
            inert={index !== selectedIndex}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
          >
            <div className="flex flex-col gap-7 md:gap-10 lg:grid lg:grid-cols-[1fr_57.66%] lg:items-center lg:gap-0">
              <div className="relative lg:col-start-2 lg:row-start-1">
                {slide.media}
              </div>

              <div className="flex flex-col gap-8 text-center md:gap-9 lg:col-start-1 lg:row-start-1 lg:pr-9 lg:text-left">
                {slide.text}
                {hasControls && controls}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoTestimonialsSlider;
