import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import clsx from "clsx";
import dynamic from "next/dynamic";
import styles from "./TrustBar.module.css";

const Default = dynamic(() => import("./variations/Default"));
const DarkBg = dynamic(() => import("./variations/DarkBg"));

/**
 * Props for `TrustBar`.
 */
export type TrustBarProps = SliceComponentProps<Content.TrustBarSlice>;

/**
 * Component for "TrustBar" Slices.
 */
const TrustBar: FC<TrustBarProps> = ({ slice }) => {
  const isDark = slice.variation === "darkBg";
  // `bg_color` only exists on the darkBg variation.
  const bgColor = slice.variation === "darkBg" ? slice.primary.bg_color : null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={clsx({
        "py-10": isDark,
        "bg-primary-dark": isDark && !bgColor,
        [styles.hasDarkBg]: isDark,
      })}
      style={isDark && bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <StyledContainer
        slice={{
          ...slice,
          primary: {
            ...slice.primary,
            ...(isDark && { top_padding: "None", bottom_padding: "None" }),
            ...(bgColor && { background_color: false }),
          },
        }}
      >
        {slice.variation === "default" && <Default slice={slice} />}
        {slice.variation === "darkBg" && <DarkBg slice={slice} />}
      </StyledContainer>
    </section>
  );
};

export default TrustBar;
