import { Content } from "@prismicio/client";
import clsx from "clsx";
import TrustBarItem from "../components/TrustBarItem";

type Props = {
  slice: Extract<Content.TrustBarSlice, { variation: "darkBg" }>;
};

// Mobile: 2-col grid, icon stacked above centered text.
// Tablet (sm+): same 2-col grid, icon beside left-aligned text.
// Desktop (lg+): single row, columns grow to fill — last item may wrap to 2 lines, that's fine.
// 1440px+: single row of fixed 314px cards, 8px gap (design spec) so nothing wraps.
const DarkBg = ({ slice }: Props) => {
  const items = slice.primary.items.filter((item) => item.label?.trim());

  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:flex lg:flex-nowrap lg:gap-x-0 lg:gap-y-0 min-[1440px]:gap-x-2">
      {items.map(({ icon, label }, idx) => (
        <TrustBarItem
          key={idx}
          icon={icon}
          label={label}
          isDark
          className={clsx(
            "flex flex-col items-center gap-y-3 text-center sm:flex-row sm:items-center sm:gap-x-4 sm:text-left xl:gap-x-3 lg:flex-1 lg:justify-start min-[1440px]:w-78.5 min-[1440px]:flex-none min-[1440px]:justify-start min-[1440px]:pl-0! min-[1440px]:pr-0!",
            {
              "lg:pl-0": idx === 0,
              "lg:pl-6": idx !== 0,
              "lg:pr-0": idx === items.length - 1,
              "lg:pr-6": idx !== items.length - 1,
            },
          )}
        />
      ))}
    </div>
  );
};

export default DarkBg;
