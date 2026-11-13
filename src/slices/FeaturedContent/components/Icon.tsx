import { asLink, Content } from "@prismicio/client";
import clsx from "clsx";
import { FeatureEyebrow, FeatureTitle, FeatureDescription } from "./index";
import { PrismicNextImage } from "@prismicio/next";
import StyledButton from "@/components/ui/StyledButton";

type Props = {
  item: Content.FeaturedContentSliceIcons["primary"]["features"][number];
  hasBg?: boolean;
};

const Icon = ({ item, hasBg }: Props) => {
  const { eyebrow, title, description, icon, link } = item;
  return (
    <div
      className={clsx({
        "p-8 text-center w-full h-full": true,
        "bg-offwhite": hasBg,
        "bg-white": !hasBg,
      })}
    >
      <PrismicNextImage
        field={icon}
        fallbackAlt=""
        height={64}
        width={64}
        className="object-cover mx-auto rounded-full mb-2"
      />
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
  );
};

export default Icon;
