import { Content, isFilled, LinkField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import Image from "next/image";
import clsx from "clsx";
import StyledContainer from "@/components/ui/StyledContainer";
import ScrollPrompt from "./ScrollPrompt";
import { portfolioBody, portfolioTitle } from "./fonts";
import styles from "./portfolio-hero.module.css";
import arrowLight from "./assets/arrow-light.svg";
import arrowDark from "./assets/arrow-dark.svg";
import checkIcon from "./assets/check.svg";
import dotSuccess from "./assets/dot-success.svg";
import dotInfo from "./assets/dot-info.svg";
import logoWatermark from "./assets/logo-watermark.svg";

type Props = {
  slice: Extract<Content.HeroSectionSlice, { variation: "portfolio" }>;
};

type ButtonLink = LinkField & { text?: string; variant?: string };

/** 18px icon frame with the 12.25 × 10.75 arrow centred, as in the Figma button. */
const Arrow = ({ dark }: { dark: boolean }) => (
  <span className="relative flex size-4.5 shrink-0 items-center justify-center transition-transform duration-200 group-hover:translate-x-1">
    {dark ? (
      <>
        <Image src={arrowDark} alt="" className="group-hover:hidden" />
        <Image src={arrowLight} alt="" className="hidden group-hover:block" />
      </>
    ) : (
      <Image src={arrowLight} alt="" />
    )}
  </span>
);

const HeroButton = ({ link }: { link: ButtonLink }) => {
  const variant = link.variant ?? "Primary";
  const kind = variant.startsWith("Secondary")
    ? "secondary"
    : variant.startsWith("Link")
      ? "link"
      : "primary";
  const hasArrow = variant.endsWith("with Arrow");

  return (
    <PrismicNextLink
      field={link}
      className={clsx(
        "group inline-flex items-center justify-center gap-2.5 rounded-full text-[18px] leading-[30px] font-medium whitespace-nowrap transition-colors duration-200 max-sm:text-[16px]",
        {
          "border border-(--ph-brand) bg-(--ph-brand) px-7 py-4 text-white hover:border-(--ph-brand-hover) hover:bg-(--ph-brand-hover)":
            kind === "primary",
          "border-[1.5px] border-(--ph-heading) bg-white px-7 py-4 text-(--ph-heading) hover:bg-(--ph-heading) hover:text-white":
            kind === "secondary",
          "px-0 py-4 text-(--ph-brand) hover:text-(--ph-brand-hover)":
            kind === "link",
        },
      )}
    >
      {link.text}
      {hasArrow && kind !== "link" && <Arrow dark={kind === "secondary"} />}
    </PrismicNextLink>
  );
};

/**
 * Personal two-column hero from the Portfolio Website Design file (Section 1 — Hero).
 * Two columns from lg; below that the portrait card drops under the copy.
 * Colours and faces are scoped to this variation (see portfolio-hero.module.css).
 */
const Portfolio = ({ slice }: Props) => {
  const {
    status_label,
    title,
    description,
    benefits,
    buttons,
    primary_button_note,
    image,
    image_badge,
    scroll_prompt,
  } = slice.primary;

  const links = (buttons as ButtonLink[]).filter(
    (link) => isFilled.link(link) && !!link.text,
  );
  const firstPrimary = links.findIndex(
    (link) => !link.variant || link.variant.startsWith("Primary"),
  );

  return (
    <StyledContainer
      slice={slice}
      // Figma at 1440: 80px above, 48px below — nearest token option is "Half" (60px)
      parentClassName={clsx(
        styles.root,
        portfolioTitle.variable,
        portfolioBody.variable,
        {
          "xl:pt-20": slice.primary.top_padding === "Half",
          "xl:pb-12": slice.primary.bottom_padding === "Half",
        },
      )}
    >
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* Left column */}
        <div
          className={clsx(
            "flex w-full min-w-0 flex-1 flex-col items-start gap-(--spacing-space-1)",
            styles.fadeUp,
          )}
        >
          {isFilled.keyText(status_label) && (
            <p className="flex items-center gap-2.5 rounded-full bg-(--ph-success-bg) px-4 py-2 text-[14px] leading-[22px] font-medium text-(--ph-success)">
              <Image src={dotSuccess} alt="" className="shrink-0" />
              {status_label}
            </p>
          )}

          <div className="flex w-full flex-col gap-6">
            <PrismicRichText
              field={title}
              components={{
                heading1: ({ children }) => (
                  <h1 className={styles.title}>{children}</h1>
                ),
                paragraph: ({ children }) => (
                  <p className={styles.title}>{children}</p>
                ),
              }}
            />
            <PrismicRichText
              field={description}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-[18px] leading-[28px] text-(--ph-description) md:text-[20px] md:leading-[30px]">
                    {children}
                  </p>
                ),
              }}
            />
          </div>

          {benefits.length > 0 && (
            <ul className="flex w-full flex-col gap-3.5">
              {benefits.map(
                (item, index) =>
                  isFilled.keyText(item.text) && (
                    <li key={index} className="flex items-center gap-3">
                      <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-(--ph-info-bg)">
                        <Image src={checkIcon} alt="" />
                      </span>
                      <span className="text-[16px] leading-[26px] text-(--ph-heading) md:text-[18px] md:leading-[30px]">
                        {item.text}
                      </span>
                    </li>
                  ),
              )}
            </ul>
          )}

          {links.length > 0 && (
            <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-start">
              {links.map((link, index) =>
                index === firstPrimary && isFilled.keyText(primary_button_note) ? (
                  <div
                    key={index}
                    className="flex flex-col items-stretch gap-2.5 sm:items-center"
                  >
                    <HeroButton link={link} />
                    <p className="text-center text-[12px] leading-[20px] text-(--ph-inactive)">
                      {primary_button_note}
                    </p>
                  </div>
                ) : (
                  <HeroButton key={index} link={link} />
                ),
              )}
            </div>
          )}
        </div>

        {/* Portrait card: 460 × 580 at desktop, same ratio below */}
        <div
          className={clsx(
            "relative aspect-460/580 w-full max-w-115 shrink-0 overflow-hidden rounded-[28px] bg-linear-to-b from-(--ph-card-from) to-(--ph-card-to)",
            styles.fadeUp,
            styles.delay1,
          )}
        >
          {isFilled.image(image) ? (
            <PrismicNextImage
              field={image}
              fallbackAlt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 460px"
              className="object-cover"
            />
          ) : (
            // 520 × 458 watermark at (-30, 40) inside the 460 × 580 card
            <Image
              src={logoWatermark}
              alt=""
              className="absolute top-[6.897%] left-[-6.522%] h-auto w-[113.043%] max-w-none"
            />
          )}

          {isFilled.keyText(image_badge) && (
            <p className="absolute bottom-7 left-7 flex items-center gap-2.5 rounded-full bg-white px-4.5 py-3 text-[14px] leading-[22px] text-(--ph-heading)">
              <Image src={dotInfo} alt="" className="shrink-0" />
              {image_badge}
            </p>
          )}
        </div>
      </div>

      {isFilled.keyText(scroll_prompt) && (
        <div
          className={clsx(
            "mt-(--spacing-space-1) hidden md:flex",
            styles.fadeUp,
            styles.delay2,
          )}
        >
          <ScrollPrompt label={scroll_prompt} />
        </div>
      )}
    </StyledContainer>
  );
};

export default Portfolio;
