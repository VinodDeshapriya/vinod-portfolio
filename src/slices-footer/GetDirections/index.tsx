import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

interface GetDirectionsContext {
  title?: string | null;
}

/**
 * Props for `GetDirections`.
 */
export type GetDirectionsProps = SliceComponentProps<
  Content.GetDirectionsSlice,
  GetDirectionsContext
>;

/**
 * Component for "GetDirections" Slices.
 */
const GetDirections: FC<GetDirectionsProps> = ({ slice, context }) => {
  if (!slice.primary.map_embed_url) return null;

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <h5 className="text-title-base-blog font-medium mb-3">
        {context?.title}
      </h5>
      <div className="w-full">
        <iframe
          src={slice.primary.map_embed_url}
          width="100%"
          height="344"
          className="border-0 block"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={context?.title ? `${context.title} map` : "Location map"}
        />
      </div>
    </div>
  );
};

export default GetDirections;
