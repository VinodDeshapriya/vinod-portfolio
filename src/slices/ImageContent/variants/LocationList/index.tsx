import { FC } from "react";
import { Content, isFilled, LinkField } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import clsx from "clsx";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";
import StyledButtonGroup from "@/components/ui/StyledButtonGroup";
import PrismicRichText from "@/components/ui/PrismicRichText";

type Props = {
  slice: Extract<Content.ImageContentSlice, { variation: "locationList" }>;
};

const LocationList: FC<Props> = ({ slice }) => {
  const links = slice.primary.links.filter((link) => !!link.text);
  // Fill the first column first: 9 links split 5 + 4.
  const half = Math.ceil(links.length / 2);
  const columns = [links.slice(0, half), links.slice(half)].filter(
    (column) => column.length,
  );

  return (
    <StyledContainer slice={slice}>
      <div
        className={clsx({
          "grid grid-cols-1 gap-(--spacing-space-1)": true,
          "lg:grid-cols-[minmax(0,596px)_minmax(0,630px)] lg:justify-between lg:items-start": true,
        })}
      >
        <div className="flex flex-col gap-(--spacing-space-2)">
          {/* Buttons render after the link list, not under the description. */}
          <StyledSectionTitle
            slice={{ primary: { ...slice.primary, buttons: [] } }}
            // this project's StyledSectionTitle only left-aligns from md/xl, and this layout goes two-column at lg
            wrapperClassName="w-full lg:mx-0 lg:text-left"
          />

          {!!columns.length && (
            <div
              className={clsx({
                "grid grid-cols-2 gap-x-4": true,
                "md:grid-cols-[auto_auto] w-fit mx-auto gap-x-10 md:gap-x-[110px]": true,
                "lg:mx-0": true,
              })}
            >
              {columns.map((column, index) => (
                <ul
                  key={index}
                  className="flex flex-col gap-4 list-disc pl-5 marker:text-primary-dark"
                >
                  {column.map((link, linkIndex) => (
                    <li
                      key={linkIndex}
                      className="text-body-base-bold text-primary-dark underline"
                    >
                      <LocationLink link={link} />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          )}

          <PrismicRichText
            field={slice.primary.footer_text}
            components={{
              paragraph: ({ children }) => (
                <p className="text-body-base text-center lg:text-left mb-0">
                  {children}
                </p>
              ),
            }}
          />

          <StyledButtonGroup slice={slice} className="lg:justify-start" />
        </div>

        <div
          className={clsx({
            "relative w-full overflow-hidden rounded-(--radius-md) aspect-square": true,
            "lg:sticky lg:top-32": true,
            "lg:order-first": !slice.primary.image_right,
          })}
        >
          <PrismicNextImage
            field={slice.primary.image}
            fallbackAlt=""
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover"
          />
        </div>
      </div>
    </StyledContainer>
  );
};

const LocationLink = ({ link }: { link: LinkField }) => {
  if (!isFilled.link(link)) return <span>{link.text}</span>;

  return (
    <PrismicNextLink
      field={link}
      className="underline hover:text-primary-dark transition-colors"
    >
      {link.text}
    </PrismicNextLink>
  );
};

export default LocationList;
