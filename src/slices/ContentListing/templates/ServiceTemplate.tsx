import { Content, asLink, asText, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import Link from "next/link";
import { Image as ImageIcon } from "atd-icons";
import clsx from "clsx";
import StyledButton from "@/components/ui/StyledButton";

type ServiceTemplateProps = {
  item: Content.ServiceDocument;
  backgroundColor?: boolean;
};

export default function ServiceTemplate({
  item,
  backgroundColor,
}: ServiceTemplateProps) {
  const { image, title, search_summary } = item.data;

  return (
    <li
      className={clsx(
        "overflow-hidden h-full rounded-md border border-border-primary",
        backgroundColor ? "bg-white" : "bg-offwhite-2",
      )}
    >
      <Link
        href={asLink(item) ?? "#"}
        className="group flex flex-col h-full"
      >
        {isFilled.image(image) ? (
          <PrismicNextImage
            field={image}
            fallbackAlt=""
            className="w-full aspect-17/10 object-cover"
          />
        ) : (
          <div
            className={clsx(
              "w-full aspect-17/10 flex items-center justify-center",
              backgroundColor ? "bg-offwhite-2" : "bg-offwhite",
            )}
          >
            <ImageIcon size={32} className="text-text-inactive" />
          </div>
        )}
        <div className="p-5 md:p-8 flex flex-col flex-1">
          <div className="text-title-medium text-text-heading">
            {asText(title)}
          </div>
          {search_summary && (
            <p className="text-body-base text-text-heading mt-4">
              {search_summary}
            </p>
          )}
          <StyledButton
            variant="Link with Arrow"
            className="mt-auto pt-4 text-body-small"
          >
            Learn More & Book
          </StyledButton>
        </div>
      </Link>
    </li>
  );
}
