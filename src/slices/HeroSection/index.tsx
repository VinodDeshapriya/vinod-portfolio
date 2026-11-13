import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import dynamic from "next/dynamic";

const FullWidth = dynamic(() => import("./variants/FullWidth"));
const TwoColumns = dynamic(() => import("./variants/TwoColumns"));
const WithBg = dynamic(() => import("./variants/withBg"));
const TwoColumnsVideo = dynamic(() => import("./variants/TwoColumnsVideo"));
const TwoColumnsForm = dynamic(() => import("./variants/TwoColumnsForm"));

type HeroSectionContext = {
  settings?: Content.SettingsDocument;
};

/**
 * Props for `HeroSection`.
 */
export type HeroSectionProps = SliceComponentProps<
  Content.HeroSectionSlice,
  HeroSectionContext
>;

/**
 * Component for "HeroSection" Slices.
 */
const HeroSection: FC<HeroSectionProps> = ({ slice, context }) => {
  const clientId = context?.settings?.data?.google_reviews_client_id;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {slice.variation === "default" && <FullWidth slice={slice} />}
      {slice.variation === "twoColumns" && (
        <TwoColumns slice={slice} clientId={clientId} />
      )}
      {slice.variation === "withBackgroundImage" && (
        <WithBg slice={slice} clientId={clientId} />
      )}
      {slice.variation === "twoColumnsVideo" && (
        <TwoColumnsVideo slice={slice} clientId={clientId} />
      )}
      {slice.variation === "twoColumnsForm" && (
        <TwoColumnsForm slice={slice} clientId={clientId} />
      )}
    </section>
  );
};

export default HeroSection;
