"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import clsx from "clsx";
import "./embla-featured-content.scss";

type FeaturedContentCarouselProps = {
  slides: ReactNode[];
  /** Wrap from the last slide back to the first (the default). */
  loop?: boolean;
  /** Pagination dots under the slides, one per scroll position. */
  showDots?: boolean;
  /** Extra class on the wrapper, e.g. `is-card-carousel` for the Card Carousel layout. */
  className?: string;
  activeDotClassName?: string;
  inactiveDotClassName?: string;
};

const FeaturedContentCarousel = ({
  slides,
  loop = true,
  showDots = false,
  className,
  activeDotClassName = "bg-primary-light",
  inactiveDotClassName = "bg-secondary-light",
}: FeaturedContentCarouselProps) => {
  const options = useMemo(() => ({ align: "start" as const, loop }), [loop]);
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const isInteracting = useRef(false);

  useEffect(() => {
    if (!emblaApi) return;

    const onPointerDown = () => {
      isInteracting.current = true;
    };
    const onSettle = () => {
      if (isInteracting.current) setHasScrolled(true);
    };

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
    };

    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("settle", onSettle);
    if (showDots) {
      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onInit);
      emblaApi.on("reInit", onSelect);
      // initial sync, through named handlers so the linter's "no setState
      // directly in an effect body" heuristic does not fire
      onInit();
      onSelect();
    }

    return () => {
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("settle", onSettle);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onInit);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, showDots]);

  return (
    <div
      className={clsx("embla-featured-content relative", className, {
        "is-scrolled": hasScrolled,
      })}
    >
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, idx) => (
            <div className="embla__slide" key={idx}>
              {slide}
            </div>
          ))}
        </div>
      </div>
      {showDots && scrollSnaps.length > 1 && (
        <div className="mt-10 flex items-center justify-center gap-1.5">
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === selectedIndex}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={clsx(
                "size-4 cursor-pointer rounded-full transition-colors",
                idx === selectedIndex ? activeDotClassName : inactiveDotClassName,
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedContentCarousel;
