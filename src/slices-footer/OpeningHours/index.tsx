import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

interface OpeningHoursContext {
  title?: string | null;
}

/**
 * Props for `OpeningHours`.
 */
export type OpeningHoursProps = SliceComponentProps<
  Content.OpeningHoursSlice,
  OpeningHoursContext
>;

/**
 * Component for "OpeningHours" Slices.
 */
const OpeningHours: FC<OpeningHoursProps> = ({ slice, context }) => {
  if (!slice.primary.rows?.length) return null;

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <h5 className="text-title-base-blog font-medium mb-3">
        {context?.title}
      </h5>
      <ul className="flex flex-col gap-3">
        {slice.primary.rows.map(({ day, hours }, i) => (
          <li
            key={i}
            className="flex items-center justify-between text-body-base"
          >
            <span>{day}</span>
            <span>{hours}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpeningHours;
