"use client";

import { createPortal } from "react-dom";
import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import clsx from "clsx";
import ReviewCard, { type CarouselItem } from "./ReviewCard";
import "./embla.scss";
import dynamicImport from "next/dynamic";

const ReviewDetailsModal = dynamicImport(() => import("./ReviewDetailsModal"));

const options = { align: "start" as const, loop: true };

interface ReviewsCarouselProps {
  reviews?: CarouselItem[];
  invertedBg?: boolean;
}

const ReviewsCarousel = ({
  reviews = [],
  invertedBg = false,
}: ReviewsCarouselProps) => {
  const [emblaRef] = useEmblaCarousel(options);
  const [review, setReview] = useState<CarouselItem | null>(null);

  return (
    <>
      {!!review &&
        typeof document !== "undefined" &&
        createPortal(
          <ReviewDetailsModal close={() => setReview(null)} review={review} />,
          document.body,
        )}
      <section className="embla-google-reviews pt-5 relative z-[1]">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {reviews.map((item, index) => {
              return (
                <div className="embla__slide flex" key={index}>
                  <div
                    className={clsx({
                      "w-full rounded-[8px] p-6": true,
                      "bg-offwhite": !invertedBg,
                      "bg-white": invertedBg,
                    })}
                  >
                    <ReviewCard item={item} setReview={() => setReview(item)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewsCarousel;
