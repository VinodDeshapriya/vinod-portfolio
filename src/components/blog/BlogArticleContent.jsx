import { asText, asLink, isFilled } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import Link from "next/link";
import slugify from "slugify";
import PrismicRichTextNormalized from "@/components/ui/PrismicRichTextNormalized";
import { components } from "@/slices-blogs";
import { PrismicNextImage } from "@prismicio/next";
import { format } from "date-fns";
import ShareButton from "@/components/ui/ShareButton";

export const makeSlug = (heading) =>
  slugify(asText(heading), { lower: true, strict: true });

export const getSubHeadings = (content) => {
  const headings = [];
  let currentH3 = null;

  for (const node of content) {
    if (node.type === "heading3" && node.text.trim()) {
      currentH3 = {
        slug: slugify(node.text, { lower: true, strict: true }),
        text: node.text,
        children: [],
      };
      headings.push(currentH3);
    } else if (node.type === "heading4" && node.text.trim() && currentH3) {
      currentH3.children.push({
        slug: slugify(node.text, { lower: true, strict: true }),
        text: node.text,
      });
    }
  }

  return headings;
};

export const ArticleHeader = ({ page }) => {
  const publisher = page.data.publisher;
  const publisherInfo =
    typeof publisher !== "string" &&
    isFilled.contentRelationship(publisher) &&
    publisher.data &&
    isFilled.richText(publisher.data.title)
      ? { name: asText(publisher.data.title), href: asLink(publisher) ?? "#" }
      : null;
  const publisherName =
    publisherInfo?.name ||
    (typeof publisher === "string" ? publisher : "") ||
    "Unknown Author";

  return (
    <>
      <h1 className="text-title-2x-large text-text-heading">
        {asText(page.data.title)}
      </h1>

      <div>
        {(page.data.publish_date || page.first_publication_date) && (
          <p className="mt-3 text-body-base text-text-description">
            Published:{" "}
            {format(
              new Date(page.data.publish_date || page.first_publication_date),
              "MMMM dd, yyyy",
            )}
          </p>
        )}

        <p className="mt-1 text-body-base text-text-description">
          By{" "}
          {publisherInfo ? (
            <Link
              href={publisherInfo.href}
              className="hover:text-primary-light"
            >
              {publisherInfo.name}
            </Link>
          ) : (
            publisherName
          )}
        </p>
      </div>

      <hr className="my-common-space border-text-heading" />
    </>
  );
};

export const ArticleHero = ({ page }) => (
  <PrismicNextImage
    field={page.data.image}
    fallbackAlt=""
    className="w-full aspect-16/10 object-cover"
  />
);

export const TableOfContents = ({ page }) => (
  <ol className="toc-list list-none m-0 p-0 [counter-reset:toc1]">
    {page.data.slices
      .filter((slice) => asText(slice.primary.title))
      .map((slice) => {
        const heading = slice.primary.title;
        const subHeadings =
          slice.slice_type === "text_block"
            ? getSubHeadings(slice.primary.content)
            : [];

        return (
          <li
            key={slice.id}
            className="text-info-primary mt-2 [counter-increment:toc1]"
          >
            <a
              href={`#${makeSlug(heading)}`}
              className="transition-colors before:inline-block before:mr-2.5 before:underline hover:text-[color-mix(in_srgb,var(--color-info-primary)_80%,black)]"
            >
              <PrismicRichTextNormalized
                field={heading}
                className={"inline underline text-body-base"}
              />
            </a>
            {subHeadings.length > 0 && (
              <ol className="list-none m-0 pl-5 mt-2 [counter-reset:toc2]">
                {subHeadings.map((h3) => (
                  <li
                    key={h3.slug}
                    className="text-body-base [counter-increment:toc2]"
                  >
                    <a
                      href={`#${h3.slug}`}
                      className="underline transition-colors hover:text-[color-mix(in_srgb,var(--color-info-primary)_80%,black)]"
                    >
                      {h3.text}
                    </a>
                    {h3.children.length > 0 && (
                      <ol className="list-none m-0 pl-5 mt-2 [counter-reset:toc3]">
                        {h3.children.map((h4) => (
                          <li
                            key={h4.slug}
                            className="[counter-increment:toc3]"
                          >
                            <a
                              href={`#${h4.slug}`}
                              className="underline transition-colors hover:text-[color-mix(in_srgb,var(--color-info-primary)_80%,black)]"
                            >
                              {h4.text}
                            </a>
                          </li>
                        ))}
                      </ol>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </li>
        );
      })}
  </ol>
);

const articleBodyComponents = {
  cta_block: components.cta_block,
  table_block: components.table_block,
  text_block: components.text_block,
};

export const ArticleBody = ({ page, settings }) => (
  <SliceZone
    slices={page.data.slices}
    components={articleBodyComponents}
    defaultComponent={() => null}
    context={{ page, settings }}
  />
);

const restBodyComponents = Object.fromEntries(
  Object.entries(components).filter(
    ([type]) => !(type in articleBodyComponents),
  ),
);

export const ArticleRestSlices = ({ page, settings }) => (
  <SliceZone
    slices={page.data.slices}
    components={restBodyComponents}
    defaultComponent={() => null}
    context={{ page, settings }}
  />
);

export const ArticleShare = ({ page, className }) => (
  <ShareButton title={asText(page.data.title)} className={className} />
);
