import { asText, LinkField, RichTextField } from "@prismicio/client";
import clsx from "clsx";
import PrismicRichTextNormalized from "./PrismicRichTextNormalized";
import PrismicRichText from "./PrismicRichText";
import StyledButtonGroup from "./StyledButtonGroup";
import { type ButtonVariantName } from "./StyledButton";

interface StyledSectionTitleProps {
  slice?: {
    primary?: {
      eyebrow?: RichTextField | undefined;
      title?: RichTextField | undefined;
      description?: RichTextField | undefined;
      buttons?: {
        label?: string;
        link?: LinkField;
        variant?: ButtonVariantName;
      }[];
    };
  };
  wrapperClassName?: string;
  leftAlign?: boolean | "md" | "xl";
  isHero?: boolean;
  invertedColors?: boolean;
}

const StyledSectionTitle = ({
  slice,
  wrapperClassName = "",
  leftAlign = false,
  isHero = false,
  invertedColors = false,
}: StyledSectionTitleProps) => {
  if (isEmptyTitleSection(slice)) {
    return null;
  }
  return (
    <div
      className={clsx({
        "text-center": leftAlign !== true,
        "md:text-left": leftAlign === "md",
        "xl:text-left": leftAlign === "xl",
        [wrapperClassName]: true,
        "flex flex-col max-w-260 mx-auto": true,
      })}
    >
      {slice?.primary?.eyebrow && (
        <PrismicRichTextNormalized
          field={slice?.primary?.eyebrow ?? []}
          className={clsx({
            "text-title-base mb-2": true,
            "text-white!": invertedColors,
          })}
        />
      )}
      <PrismicRichTextNormalized
        field={slice?.primary?.title ?? []}
        className={clsx({
          "text-title-3x-large": isHero,
          "text-title-2x-large": !isHero,
          "text-white!": invertedColors,
        })}
      />
      {slice?.primary?.description && (
        <PrismicRichText
          field={slice?.primary?.description}
          components={{
            paragraph: ({ children }) => (
              <p
                className={clsx({
                  "mt-3 text-body-base": true,
                  "last:mb-0": isHero,
                  "text-white!": invertedColors,
                })}
              >
                {children}
              </p>
            ),
          }}
        />
      )}

      <StyledButtonGroup slice={slice} leftAlign={leftAlign} className="mt-6" />
    </div>
  );
};

export default StyledSectionTitle;

export const isEmptyTitleSection = (
  slice: StyledSectionTitleProps["slice"],
) => {
  return (
    !asText(slice?.primary?.eyebrow) &&
    !asText(slice?.primary?.title) &&
    !asText(slice?.primary?.description) &&
    !slice?.primary?.buttons?.length
  );
};
