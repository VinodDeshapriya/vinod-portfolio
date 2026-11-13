import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import PrismicRichText from "@/components/ui/PrismicRichText";

interface FootContentsContext {
  title?: string | null;
}

/**
 * Props for `FootContents`.
 */
export type FootContentsProps = SliceComponentProps<
  Content.FootContentsSlice,
  FootContentsContext
>;

/**
 * Component for "FootContents" Slices.
 */
const FootContents: FC<FootContentsProps> = ({ slice, context }) => {
  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <h5 className="text-title-base-blog font-medium mb-3">
        {context?.title}
      </h5>
      <PrismicRichText
        field={slice.primary.description}
        components={{
          paragraph: ({ children }) => (
            <p className="text-body-base mb-1.5 last:mb-0">{children}</p>
          ),
        }}
      />
    </div>
  );
};

export default FootContents;
