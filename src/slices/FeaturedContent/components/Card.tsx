import { asLink, Content, RichTextField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import clsx from "clsx";
import PrismicRichText from "@/components/ui/PrismicRichText";
import PrismicRichTextNormalized from "@/components/ui/PrismicRichTextNormalized";
import StyledButton from "@/components/ui/StyledButton";

type Props = {
  item: Content.FeaturedContentSliceGrid["primary"]["features"][number];
  /**
   * Grid layout only: the card takes its 4 rows (icon, title, description, link) from the
   * grid, so titles, descriptions and links line up across a row even when a title wraps.
   * The carousel layout leaves it off and renders exactly as before.
   */
  subgrid?: boolean;
};

// Card-specific typography (kept local so the shared FeatureTitle/FeatureDescription used by the other variations are untouched)
const FeatureTitle = ({ content }: { content: RichTextField }) => (
  <PrismicRichTextNormalized
    field={content}
    className="text-title-medium mb-3"
  />
);

const FeatureDescription = ({
  content,
}: {
  content: RichTextField | undefined;
}) => (
  <PrismicRichText
    field={content}
    components={{
      paragraph: ({ children }) => (
        <p className="text-body-base mb-6 last:mb-0">{children}</p>
      ),
    }}
  />
);

const Card = ({ item, subgrid = false }: Props) => {
  const { title, description, icon, link } = item;
  return (
    <div
      className={clsx(
        "h-full w-full rounded-md border border-primary-light bg-white p-6 md:p-8 text-left",
        subgrid ? "row-span-4 grid grid-rows-subgrid gap-0" : "flex flex-col",
      )}
    >
      <div className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-full">
        <PrismicNextImage
          field={icon}
          fallbackAlt=""
          height={52}
          width={52}
          className="object-contain"
        />
      </div>
      {subgrid ? (
        <>
          <div>
            <FeatureTitle content={title} />
          </div>
          {/* one row for the whole description; its last paragraph has no margin, so the wrapper keeps the gap */}
          <div className="mb-6">
            <FeatureDescription content={description} />
          </div>
        </>
      ) : (
        <>
          <FeatureTitle content={title} />
          <FeatureDescription content={description} />
        </>
      )}
      <StyledButton
        link={asLink(link) ?? undefined}
        variant={link?.variant}
        target={link?.link_type === "Web" ? link.target : undefined}
        className="mt-auto"
      >
        {link?.text}
      </StyledButton>
    </div>
  );
};

export default Card;
