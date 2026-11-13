import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle, {
  isEmptyTitleSection,
} from "@/components/ui/StyledSectionTitle";
import clsx from "clsx";
import styles from "./Stats.module.css";
import SocialProof from "./components/SocialProof";

/**
 * Props for `Stats`.
 */
export type StatsProps = SliceComponentProps<Content.StatsSlice>;

/**
 * Component for "Stats" Slices.
 */
const Stats: FC<StatsProps> = ({ slice }) => {
  // Its own section and grid — see the note in the component for why it does
  // not share the markup or `Stats.module.css` below.
  if (slice.variation === "socialProof") return <SocialProof slice={slice} />;

  const total = slice?.primary?.stats?.length ?? 0;
  const isQuad = total === 4;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={clsx({
        "bg-primary-dark hasDarkBg": slice.variation === "darkBg",
        [styles.hasDarkBg]: slice.variation === "darkBg",
        "bg-bg-white": slice.variation === "default",
      })}
    >
      <StyledContainer slice={slice}>
        <StyledSectionTitle slice={slice} />

        <div
          className={clsx({
            "flex flex-wrap justify-center": true,
            "mt-8 lg:mt-12": !isEmptyTitleSection(slice),
          })}
        >
          {slice?.primary?.stats?.map(
            ({ prefix, suffix, value, icon }, idx) => (
              <div
                key={idx}
                className={clsx(styles.item, {
                  [styles.quad]: isQuad,
                  "p-8 text-center w-full": true,
                  "md:w-1/2 xl:w-1/4": isQuad,
                  "md:w-1/2 lg:w-1/3": !isQuad,
                  "border-b border-b-border-primary md:border-b-0": total > 3,
                })}
              >
                {icon?.url && (
                  <PrismicNextImage
                    field={icon}
                    fallbackAlt=""
                    height={64}
                    width={64}
                    className="object-contain mx-auto mb-2"
                  />
                )}
                <p
                  className={clsx({
                    "text-body-base": true,
                  })}
                >
                  {prefix}
                </p>
                <p
                  className={clsx({
                    "text-title-3x-large": true,
                  })}
                >
                  {value}
                </p>
                <p
                  className={clsx({
                    "text-body-base": true,
                  })}
                >
                  {suffix}
                </p>
              </div>
            ),
          )}
        </div>
      </StyledContainer>
    </section>
  );
};

export default Stats;
