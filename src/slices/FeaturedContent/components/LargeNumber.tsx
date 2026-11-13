import { asLink, Content } from "@prismicio/client";
import clsx from "clsx";
import { FeatureEyebrow, FeatureTitle, FeatureDescription } from "./index";
import StyledButton from "@/components/ui/StyledButton";

type Props = {
  item: Content.FeaturedContentSliceDefault["primary"]["features"][number];
  index?: number;
  hasBg?: boolean;
};

const LargeNumber = ({ item, index, hasBg }: Props) => {
  const { eyebrow, title, description, link } = item;
  return (
    <div
      className={clsx({
        "relative p-8 rounded-(--radius-md) w-full h-full overflow-hidden min-h-80 flex flex-col": true,
        "bg-offwhite": hasBg,
        "bg-white": !hasBg,
      })}
    >
      <p className="absolute pointer-events-none -right-3 bottom-0 text-primary-light opacity-10 text-[100px] md:text-[150px] lg:text-[220px] font-bold leading-[70%]">
        {index}
      </p>
      <FeatureEyebrow content={eyebrow} />
      <FeatureTitle content={title} />
      <div className="mt-auto">
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

export default LargeNumber;
