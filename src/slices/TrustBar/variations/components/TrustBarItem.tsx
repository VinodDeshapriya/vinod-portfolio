import { ImageField, KeyTextField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import clsx from "clsx";

type Props = {
  icon: ImageField<never>;
  label: KeyTextField;
  isDark: boolean;
  className?: string;
};

const TrustBarItem = ({ icon, label, isDark, className }: Props) => {
  return (
    <div className={className}>
      {icon?.url &&
        (isDark ? (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <PrismicNextImage field={icon} fallbackAlt=""  />
          </div>
        ) : (
          <PrismicNextImage
            field={icon}
            fallbackAlt=""
            height={32}
            width={32}
            className="shrink-0"
          />
        ))}
      <p
        className={clsx({
          "text-body-base-bold font-bold!": isDark,
          "text-body-base-bold font-medium": !isDark,
        })}
      >
        {label}
      </p>
    </div>
  );
};

export default TrustBarItem;
