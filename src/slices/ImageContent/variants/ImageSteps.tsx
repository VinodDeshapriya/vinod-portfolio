import { FC } from "react";
import { asLink, Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import clsx from "clsx";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";
import StyledButtonGroup from "@/components/ui/StyledButtonGroup";
import StyledButton from "@/components/ui/StyledButton";
import PrismicRichTextNormalized from "@/components/ui/PrismicRichTextNormalized";

type ImageStepsProps = {
  slice: Extract<Content.ImageContentSlice, { variation: "imageSteps" }>;
};

/**
 * "Steps with Image" variation of ImageContent: title block and a
 * numbered list of steps beside a square image. Below `lg` the text is
 * centred and the image drops underneath.
 */
const ImageSteps: FC<ImageStepsProps> = ({ slice }) => {
  const { buttons, features, image, image_right } = slice.primary;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer slice={slice}>
        {/* Figma at 1440: two 596px columns 88px apart */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-(--spacing-space-1) xl:gap-22">
          <div>
            {/* StyledSectionTitle only left-aligns from md or xl; this layout goes two-column at lg */}
            <div className="lg:[&>div]:mx-0 lg:[&>div]:text-left">
              <StyledSectionTitle
                slice={{
                  primary: {
                    eyebrow: slice.primary.eyebrow,
                    title: slice.primary.title,
                    description: slice.primary.description,
                  },
                }}
              />
            </div>

            {features.length > 0 && (
              <ol className="mx-auto mt-8 flex max-w-128 flex-col gap-6 text-left lg:mx-0 lg:mt-10 lg:max-w-none">
                {features.map((item, index) => (
                  <li key={index} className="flex gap-4 lg:gap-5">
                    {/* rounded-[50%], not rounded-full: the --radius-full token is 6px */}
                    <span
                      aria-hidden
                      className="relative flex size-12 shrink-0 items-center justify-center rounded-[50%]"
                    >
                      <span className="absolute inset-0 rounded-[50%] bg-primary-light opacity-62" />
                      <span className="absolute inset-[6.86px] rounded-[50%] bg-primary-light" />
                      <span className="relative text-[14px] leading-5.5 font-bold text-text-light">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <PrismicRichTextNormalized
                        field={item.title}
                        className="text-title-base text-text-heading"
                      />
                      <PrismicRichTextNormalized
                        field={item.description}
                        className="mt-1.5 text-body-base-bold text-text-description lg:mt-2"
                      />
                      {isFilled.link(item.link) && (
                        <StyledButton
                          link={asLink(item.link) ?? undefined}
                          variant={item.link.variant}
                          target={
                            item.link.link_type === "Web"
                              ? item.link.target
                              : undefined
                          }
                          className="mt-3"
                        >
                          {item.link.text}
                        </StyledButton>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <StyledButtonGroup
              slice={{ primary: { buttons } }}
              leftAlign={"xl"}
              className="mt-10"
            />
          </div>

          <div
            className={clsx("w-full", {
              "lg:order-first": !image_right,
            })}
          >
            <div className="relative aspect-square overflow-hidden rounded-(--radius-md)">
              <PrismicNextImage
                field={image}
                fallbackAlt=""
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </StyledContainer>
    </section>
  );
};

export default ImageSteps;
