import { ImageField, KeyTextField } from "@prismicio/client";
import clsx from "clsx";
import {
  chunkTrustItems,
  ITEM_WIDTH_CLASSES,
} from "../../utils/trustItemLayout";
import TrustBarItem from "./TrustBarItem";

type Item = {
  icon: ImageField<never>;
  label: KeyTextField;
};

type Props = {
  items: readonly Item[];
  isDark: boolean;
};

const TrustBarRows = ({ items: rawItems, isDark }: Props) => {
  const items = rawItems.filter((item) => item.label?.trim());

  if (!items.length) return null;

  const rows = chunkTrustItems(items);

  // The widest row (usually 4) stretches full width with equal columns.
  // Any shorter row (like a last row of 2 or 3) just centers at its
  // natural size instead — nothing to stretch it to match.
  const maxCols = Math.max(...rows.map((row) => row.length));
  const itemWidthClass = ITEM_WIDTH_CLASSES[maxCols] ?? ITEM_WIDTH_CLASSES[4];

  return (
    <div className="flex flex-col gap-y-8">
      {rows.map((row, rowIndex) => {
        const isFullRow = row.length === maxCols;

        return (
          <div
            key={rowIndex}
            className={clsx("flex flex-wrap gap-6", {
              "justify-center": !isFullRow,
              "divide-x divide-white/15": isDark && isFullRow,
            })}
          >
            {row.map(({ icon, label }, itemIndex) => (
              <TrustBarItem
                key={itemIndex}
                icon={icon}
                label={label}
                isDark={isDark}
                className={`${itemWidthClass} flex basis-full items-center justify-center gap-x-4 py-1 ${isFullRow ? "sm:basis-0 sm:grow" : "sm:basis-auto"}`}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default TrustBarRows;
