import { Content, asLink, asText, isFilled } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
import { Image as ImageIcon, Linkedin } from "atd-icons";
import clsx from "clsx";
import { withAbsoluteUrl } from "@/utils/toAbsoluteUrl";

type AuthorTemplateProps = {
  item: Content.AuthorDocument;
  backgroundColor?: boolean;
};

export default function AuthorTemplate({
  item,
  backgroundColor,
}: AuthorTemplateProps) {
  const { image, title, summary, linkedin } = item.data;

  return (
    <li
      className={clsx(
        "flex flex-col items-center text-center h-full rounded-md max-w-[405px] p-6 md:p-8",
        backgroundColor ? "bg-white" : "bg-offwhite",
      )}
    >
      {isFilled.image(image) ? (
        <PrismicNextImage
          field={image}
          fallbackAlt=""
          className="size-25 lg:size-[150px] rounded-full aspect-square object-cover shrink-0"
        />
      ) : (
        <div className="size-40 rounded-full aspect-square flex items-center justify-center bg-offwhite shrink-0">
          <ImageIcon size={32} className="text-text-inactive" />
        </div>
      )}

      <div className="text-title-large text-text-heading mt-5">
        {asText(title)}
      </div>

      {isFilled.richText(summary) && (
        <p className="text-body-base text-text-description my-2 line-clamp-4">
          {asText(summary)}
        </p>
      )}

      {isFilled.link(linkedin) && (
        <PrismicNextLink
          field={withAbsoluteUrl(linkedin)}
          aria-label="LinkedIn"
          className="text-primary-light hover:text-primary-dark transition-colors "
        >
          <Linkedin size={40} />
        </PrismicNextLink>
      )}

      <Link
        href={asLink(item) ?? "#"}
        className="text-primary-light underline underline-offset-2 text-body-base font-medium mt-5"
      >
        View Profile
      </Link>
    </li>
  );
}
