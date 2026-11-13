import { ImageField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import clsx from "clsx";

interface HeroImageProps {
  image: ImageField<never>;
  aspect: "square" | "video";
  sizes: string;
  className?: string;
  roundBottom?: boolean;
}

const HeroImage = ({
  image,
  aspect,
  sizes,
  className,
  roundBottom = true,
}: HeroImageProps) => (
  <div
    className={clsx(
      "relative overflow-hidden rounded-t-(--radius-md)",
      roundBottom ? "rounded-b-(--radius-md)" : "rounded-b-none",
      aspect === "square" ? "aspect-square" : "aspect-video",
      className,
    )}
  >
    <PrismicNextImage
      field={image}
      fallbackAlt=""
      fill
      sizes={sizes}
      className="object-cover"
    />
  </div>
);

export default HeroImage;
