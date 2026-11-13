import { Content } from "@prismicio/client";
import clsx from "clsx";
import PrismicRichText from "@/components/ui/PrismicRichText";
import PrismicRichTextNormalized from "@/components/ui/PrismicRichTextNormalized";

type Props = {
  features: Content.FeaturedContentSliceSteps["primary"]["features"];
};

const StepBadge = ({ index }: { index: number }) => (
  <div className="shrink-0 h-[48px] w-[48px] rounded-full bg-primary-light text-text-light flex items-center justify-center text-[18px] leading-[24px] md:text-[24px] md:leading-[32px]">
    {index}
  </div>
);

const Steps = ({ features }: Props) => {
  // One set of steps for every screen (each title is in the page once): stacked on phones; from md the steps sit in
  // columns, each badge between dashed lines that join it to its neighbours.
  const gridStyle = { "--steps-cols": features.length } as React.CSSProperties;

  return (
    <div
      className="mt-7 md:mt-[32px] grid grid-cols-1 gap-10 md:gap-8 md:[grid-template-columns:repeat(var(--steps-cols),minmax(0,1fr))]"
      style={gridStyle}
    >
      {features.map((item, idx) => (
        <div key={idx} className="text-center">
          <div className="flex items-center justify-center mb-4 md:mb-10">
            <div
              className={clsx(
                "hidden md:block flex-1 border-t border-dashed border-border-primary",
                idx === 0 ? "invisible" : "-ml-4",
              )}
            />
            <StepBadge index={idx + 1} />
            <div
              className={clsx(
                "hidden md:block flex-1 border-t border-dashed border-border-primary",
                idx === features.length - 1 ? "invisible" : "-mr-4",
              )}
            />
          </div>
          <PrismicRichTextNormalized
            field={item.title}
            className="text-title-medium mb-3"
          />
          <PrismicRichText
            field={item.description}
            components={{
              paragraph: ({ children }) => (
                <p className="text-body-base mb-6 last:mb-0">{children}</p>
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Steps;
