import { asLink, Content } from "@prismicio/client";
import clsx from "clsx";
import { FeatureEyebrow, FeatureTitle, FeatureDescription } from "./index";
import { PrismicNextImage } from "@prismicio/next";
import StyledButton from "@/components/ui/StyledButton";

type Props = {
  item: Content.FeaturedContentSliceImages["primary"]["features"][number];
  hasBg?: boolean;
};

const Image = ({ item, hasBg }: Props) => {
  const { eyebrow, title, description, image, link } = item;
  return (
    <div
      className={clsx({
        "w-full h-full border border-border-primary rounded-(--radius-md) overflow-hidden": true,
        "bg-offwhite": hasBg,
        "bg-white": !hasBg,
      })}
    >
      <div
        className={clsx({
          "relative overflow-hidden": true,
          "aspect-video": true,
        })}
      >
        <PrismicNextImage
          field={image}
          fallbackAlt=""
          fill
          sizes={"(max-width: 1200px) 100vw, 1080px"}
          className="object-cover"
        />
      </div>
      <div className="p-8">
        <FeatureEyebrow content={eyebrow} />
        <FeatureTitle content={title} />
        <FeatureDescription content={description} />
        <StyledButton
          link={asLink(link) ?? undefined}
          variant={link?.variant}
          target={link?.link_type === "Web" ? link.target : undefined}
        >
          {link?.text}
        </StyledButton>
      </div>
    </div>
  );
};

export default Image;
