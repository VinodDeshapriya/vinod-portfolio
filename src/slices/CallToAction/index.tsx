import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import dynamic from "next/dynamic";

const Default = dynamic(() => import("./variants/default"));
const CappedWidth = dynamic(() => import("./variants/cappedWidth"));

/**
 * Props for `Cta`.
 */
export type CtaProps = SliceComponentProps<Content.CTASlice>;

/**
 * Component for "Cta" Slices.
 */
const CallToAction: FC<CtaProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {slice.variation === "default" && <Default slice={slice} />}
      {slice.variation === "cappedWidth" && <CappedWidth slice={slice} />}
    </section>
  );
};

export default CallToAction;
