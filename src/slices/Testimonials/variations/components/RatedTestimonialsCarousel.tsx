"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import clsx from "clsx";
import RatedTestimonialCard, {
  type RatedTestimonial,
} from "./RatedTestimonialCard";
import "./embla-rated-cards.scss";

const options = {
  align: "start" as const,
  loop: false,
  containScroll: "trimSnaps" as const,
};

interface RatedTestimonialsCarouselProps {
  testimonials: RatedTestimonial[];
}

const RatedTestimonialsCarousel = ({
  testimonials,
}: RatedTestimonialsCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const dotsCount = scrollSnaps.length;
  // Above 1200px, 3 or fewer testimonials lay out flat and centered
  // (no scrolling needed); more than that keeps peeking/scrolling at
  // every breakpoint instead of being cropped by the centered layout.
  const isFlatLayout = testimonials.length <= 3;

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onInit = () => setScrollSnaps(emblaApi.scrollSnapList());

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);

    onInit();
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onInit);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <section
      className={clsx("embla-rated-cards pt-7 md:pt-8 relative z-[1]", {
        "embla-rated-cards--flat": isFlatLayout,
      })}
    >
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {testimonials.map((item, index) => (
            <div className="embla__slide flex" key={index}>
              <RatedTestimonialCard item={item} />
            </div>
          ))}
        </div>
      </div>
      {dotsCount > 1 && (
        <div className="mt-7 md:mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: dotsCount }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={clsx("h-3 w-3 rounded-full transition-colors", {
                "bg-primary-light": idx === selectedIndex,
                "bg-secondary-light": idx !== selectedIndex,
              })}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RatedTestimonialsCarousel;
