import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import LocationFill from "atd-icons/dist/LocationFill";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";

/**
 * Props for `ServiceArea`.
 */
export type ServiceAreaProps = SliceComponentProps<Content.ServiceAreaSlice>;

/**
 * Component for "ServiceArea" Slices.
 *
 * Figma: service_area_variants1 — "Courier Services Across Australia": title block + city chips beside a hub-map card
 * (map, route, pins and labels are one image; the info card is editable text). 1440: map left 596 / content right 630;
 * 768 and 375: stacked and centred, map full width. The whole map card scales as one unit in the design, so the info
 * card is sized in container units (cqw) of the card.
 */
const ServiceArea: FC<ServiceAreaProps> = ({ slice }) => {
  const { locations, map_image, info_card_title, info_card_text } = slice.primary;
  // every chip with a label shows; only chips with a link are clickable (cities without a page yet stay plain text)
  const chips = (locations ?? []).filter((l) => l.text);
  const chipClass =
    "text-body-small !font-medium inline-flex items-center gap-2 rounded-(--radius-full) border border-border-primary bg-white py-[9px] pr-[18px] pl-3.5 text-text-heading";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer slice={slice}>
        <div className="flex flex-col items-center gap-7 md:gap-8 xl:flex-row xl:justify-between xl:gap-0">
          <div className="flex w-full flex-col items-center gap-6 md:gap-7 xl:w-[630px] xl:shrink-0 xl:items-start xl:gap-8">
            <StyledSectionTitle slice={slice} leftAlign="xl" />
            {chips.length > 0 && (
              <ul className="flex flex-wrap justify-center gap-3 xl:justify-start">
                {chips.map((link, i) => (
                  <li key={`${link.text}-${i}`}>
                    {isFilled.link(link) ? (
                      <PrismicNextLink
                        field={link}
                        className={`${chipClass} transition-colors hover:border-primary-light hover:bg-primary-light/10 hover:text-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light`}
                      >
                        <LocationFill size={18} className="shrink-0 text-primary-light" aria-hidden="true" />
                        {link.text}
                      </PrismicNextLink>
                    ) : (
                      <span className={chipClass}>
                        <LocationFill size={18} className="shrink-0 text-primary-light" aria-hidden="true" />
                        {link.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
  
          {isFilled.image(map_image) && (
            <div className="w-full xl:order-first xl:w-[596px] xl:shrink-0">
              <div className="@container relative aspect-[688/600] w-full overflow-hidden rounded-(--radius-xs) md:rounded-(--radius-md)">
                <PrismicNextImage field={map_image} fallbackAlt="" fill sizes="(max-width: 768px) 100vw, 596px" className="object-cover" />
                {(isFilled.keyText(info_card_title) || isFilled.keyText(info_card_text)) && (
                  <div className="absolute bottom-[4.07cqw] left-[3.488cqw] flex items-center gap-[2.035cqw] rounded-[1.744cqw] bg-white py-[2.035cqw] pr-[3.198cqw] pl-[2.035cqw] shadow-[0_4px_8px_rgba(16,24,40,0.08),0_2px_4px_rgba(16,24,40,0.06)]">
                    <span className="flex size-[6.395cqw] shrink-0 items-center justify-center rounded-(--radius-full) bg-secondary-light text-primary-dark">
                      <span className="size-[3.198cqw]">
                        <LocationFill size="100%" aria-hidden="true" />
                      </span>
                    </span>
                    <span className="flex flex-col gap-[0.29cqw] whitespace-nowrap">
                      {isFilled.keyText(info_card_title) && (
                        <span className="text-title-base-blog text-text-heading">{info_card_title}</span>
                      )}
                      {isFilled.keyText(info_card_text) && (
                        <span className="text-caption text-text-description">{info_card_text}</span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </StyledContainer>
    </section>
  );
};

export default ServiceArea;
