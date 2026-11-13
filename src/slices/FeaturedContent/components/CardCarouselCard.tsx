import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import PrismicRichText from "@/components/ui/PrismicRichText";
import PrismicRichTextNormalized from "@/components/ui/PrismicRichTextNormalized";

type Props = {
  item: Content.FeaturedContentSliceCardCarousel["primary"]["features"][number];
};

/**
 * Card for the Card Carousel variation: image on top, then the title and the
 * description. The colors are the design's: text-inactive (#8C8C8C) card,
 * text-description (#454343) behind the image, white text.
 */
const CardCarouselCard = ({ item }: Props) => {
  const { image, title, description } = item;

  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-text-inactive p-6 text-left text-white md:p-8">
      <div className="relative mb-6 aspect-[32/15] shrink-0 overflow-hidden rounded-md bg-text-description">
        <PrismicNextImage
          field={image}
          fallbackAlt=""
          fill
          sizes="(max-width: 1024px) 334px, 405px"
          className="object-cover"
        />
      </div>
      <PrismicRichTextNormalized
        field={title}
        className="text-title-medium mb-3"
      />
      <PrismicRichText
        field={description}
        components={{
          paragraph: ({ children }) => (
            <p className="text-body-base mb-6 last:mb-0">{children}</p>
          ),
        }}
      />
    </div>
  );
};

export default CardCarouselCard;
