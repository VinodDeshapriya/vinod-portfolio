import { asLink, Content } from "@prismicio/client";
import clsx from "clsx";
import { FeatureEyebrow, FeatureTitle, FeatureDescription } from "./index";
import StyledButton from "@/components/ui/StyledButton";

type Props = {
  item: Content.FeaturedContentSliceSmallNumbers["primary"]["features"][number];
  index?: number;
  hasBg?: boolean;
};

const SmallNumber = ({ item, index, hasBg }: Props) => {
  const { eyebrow, title, description, link } = item;
  return (
    <div
      className={clsx({
        "xl:px-6 py-5 md:py-6 text-center w-full h-full": true,
      })}
    >
      <div className="my-2 md:my-3 mx-auto rounded-full relative  h-13 md:h-15 w-13 md:w-15 bg-primary-light mb-3.5 md:mb-4 xl:mb-5">
        <span className="relative z-20 text-title-x-large text-text-light">
          {index}
        </span>
        <div className="pointer-events-none h-18 md:h-20 w-18 md:w-20 absolute left-1/2 top-1/2 translate-[-50%] z-10 bg-primary-light opacity-60 rounded-full" />
      </div>
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

export default SmallNumber;
