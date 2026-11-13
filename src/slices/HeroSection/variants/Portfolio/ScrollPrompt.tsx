"use client";

import Image from "next/image";
import arrowDown from "./assets/arrow-down.svg";

/**
 * "Keep scrolling" — smooth-scrolls to whatever section follows the hero.
 */
const ScrollPrompt = ({ label }: { label: string }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const section = event.currentTarget.closest("section");
    const next = section?.nextElementSibling;
    const top = next
      ? next.getBoundingClientRect().top + window.scrollY
      : (section?.getBoundingClientRect().bottom ?? 0) + window.scrollY;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex items-center gap-2 text-[14px] leading-[22px] tracking-[1.68px] text-(--ph-inactive) uppercase transition-colors hover:text-(--ph-heading)"
    >
      {/* 16px icon frame; the 10 × 11.33 glyph sits centred in it, as in Figma */}
      <span className="flex size-4 shrink-0 items-center justify-center transition-transform group-hover:translate-y-0.5">
        <Image src={arrowDown} alt="" />
      </span>
      {label}
    </button>
  );
};

export default ScrollPrompt;
