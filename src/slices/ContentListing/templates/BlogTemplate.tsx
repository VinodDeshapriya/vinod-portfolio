import { Content, asLink, asText, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import Link from "next/link";
import { format } from "date-fns";
import { Image as ImageIcon } from "atd-icons";
import clsx from "clsx";

type BlogTemplateProps = {
  item: Content.BlogDocument;
  backgroundColor?: boolean;
};

export default function BlogTemplate({
  item,
  backgroundColor,
}: BlogTemplateProps) {
  const { image, title, summary, publisher, publish_date } = item.data;
  const displayDate = publish_date || item.first_publication_date;

  const authorName =
    typeof publisher === "string"
      ? publisher || "Unknown Author"
      : isFilled.contentRelationship(publisher) &&
          publisher.data &&
          isFilled.richText(publisher.data.title)
        ? asText(publisher.data.title)
        : "Unknown Author";

  return (
    <li className={clsx(backgroundColor ? "bg-white" : "bg-offwhite-2")}>
      <Link href={asLink(item) ?? "#"}>
        {isFilled.image(image) ? (
          <PrismicNextImage
            field={image}
            fallbackAlt=""
            className="w-full aspect-340/212 object-cover"
          />
        ) : (
          <div
            className={clsx(
              "w-full aspect-340/212 flex items-center justify-center",
              backgroundColor ? "bg-offwhite-2" : "bg-offwhite",
            )}
          >
            <ImageIcon size={32} className="text-text-inactive" />
          </div>
        )}
        <div className="p-3">
          <h2 className="text-title-base-blog text-text-heading">{asText(title)}</h2>
          {summary ? <p className="text-body-base text-text-description mt-2 line-clamp-3">{summary}</p> : null}
          {(authorName || displayDate) && (
            <div className="flex items-center justify-between mt-4 text-body-small text-text-description">
              <span>{authorName}</span>
              {displayDate ? (
                <span>{format(new Date(displayDate), "M/d/yy")}</span>
              ) : null}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}
