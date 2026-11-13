"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { EmbedField } from "@prismicio/client";

interface TestimonialVideoProps {
  embed: EmbedField;
}

/**
 * Play button over a testimonial image that opens the embedded video in a
 * popup. Follows HeroSection's HeroVideo, with the smaller mobile button
 * from the Video Testimonial design.
 */
const TestimonialVideo = ({ embed }: TestimonialVideoProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!embed.html) return null;

  return (
    <>
      {/* rounded-[50%], not rounded-full: the --radius-full token is 6px */}
      <button
        type="button"
        aria-label="Play video"
        onClick={() => setOpen(true)}
        className="absolute left-1/2 top-1/2 size-16 -translate-1/2 cursor-pointer rounded-[50%] transition-transform duration-300 hover:scale-105 md:size-38.5"
      >
        <svg viewBox="0 0 154.401 154.401" className="size-full" aria-hidden>
          <circle
            cx="77.2007"
            cy="77.2007"
            r="77.2007"
            fill="white"
            fillOpacity="0.5"
          />
          <path
            d="M101.879 69.7725C107.212 72.8517 107.212 80.5497 101.879 83.6289L70.8623 101.536C65.529 104.616 58.8623 100.767 58.8623 94.6081L58.8623 58.7932C58.8623 52.6348 65.529 48.7858 70.8623 51.865L101.879 69.7725Z"
            fill="#6E6E6E"
          />
        </svg>
      </button>

      {/* Portal to <body>: the carousel moves slides with a CSS transform,
          which would otherwise make this `fixed` overlay position against
          the slider instead of the viewport */}
      {open &&
        createPortal(
          <dialog
            open
            aria-label={embed.title ?? "Video"}
            className="fixed left-0 top-0 z-999999 flex h-screen w-full items-center justify-center bg-[rgba(0,0,0,0.7)]"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative aspect-video w-[90%] max-w-240"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close video"
                onClick={() => setOpen(false)}
                className="absolute -top-12 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] bg-white"
              >
                &#x2715;
              </button>
              <div
                className="size-full overflow-hidden rounded-(--radius-md) bg-black [&_iframe]:size-full"
                dangerouslySetInnerHTML={{ __html: embed.html }}
              />
            </div>
          </dialog>,
          document.body,
        )}
    </>
  );
};

export default TestimonialVideo;
