import { Content, filter, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import clsx from "clsx";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";
import StyledButtonGroup from "@/components/ui/StyledButtonGroup";
import { createClient } from "@/prismicio";
import dynamic from "next/dynamic";

const client = createClient();

const RELATED_BLOG_COUNT = 3;

const BlogTemplate = dynamic(
  () => import("../ContentListing/templates/BlogTemplate"),
);
const ServiceTemplate = dynamic(
  () => import("../ContentListing/templates/ServiceTemplate"),
);

type FeaturedContentListingContext = {
  page?: Content.BlogDocument | Content.PageDocument | null;
};

/**
 * Props for `FeaturedContentListing`.
 */
export type FeaturedContentListingProps = SliceComponentProps<
  Content.FeaturedContentListingSlice,
  FeaturedContentListingContext
>;

/**
 * On the Blog variation, when used inside a blog post's own body (Related
 * Articles) with no manually picked items, finds nearby posts to fill in:
 * same-category posts first, then any other recent post as a fallback.
 */
async function getRelatedBlogIds(currentBlog: Content.BlogDocument) {
  const categoryId = isFilled.contentRelationship(currentBlog.data.category)
    ? currentBlog.data.category.id
    : null;

  const relatedIds: string[] = [];

  if (categoryId) {
    const sameCategory = await client.getByType("blog", {
      pageSize: RELATED_BLOG_COUNT,
      orderings: { field: "my.blog.publish_date", direction: "desc" },
      filters: [
        filter.at("my.blog.category", categoryId),
        filter.not("document.id", currentBlog.id),
      ],
      fetch: ["blog.uid"],
    });
    relatedIds.push(...sameCategory.results.map((doc) => doc.id));
  }

  if (relatedIds.length < RELATED_BLOG_COUNT) {
    const fallback = await client.getByType("blog", {
      pageSize: RELATED_BLOG_COUNT - relatedIds.length,
      orderings: { field: "my.blog.publish_date", direction: "desc" },
      filters: [currentBlog.id, ...relatedIds].map((id) =>
        filter.not("document.id", id),
      ),
      fetch: ["blog.uid"],
    });
    relatedIds.push(...fallback.results.map((doc) => doc.id));
  }

  return relatedIds;
}

/**
 * Component for "FeaturedContentListing" Slices.
 */
export default async function FeaturedContentListing({
  slice,
  context,
}: FeaturedContentListingProps) {
  const isBlog = slice.variation === "default";

  const manualIds = slice.primary.items
    .map((row) => row.content)
    .filter(isFilled.contentRelationship)
    .map((content) => content.id);

  const currentBlog =
    isBlog && context?.page?.type === "blog" ? context.page : null;

  const ids =
    manualIds.length === 0 && currentBlog
      ? await getRelatedBlogIds(currentBlog)
      : manualIds;

  const docsById = new Map(
    ids.length
      ? (
          await client.getByIDs(ids, {
            fetch: isBlog
              ? [
                  "blog.title",
                  "blog.summary",
                  "blog.image",
                  "blog.publisher",
                  "blog.publish_date",
                ]
              : ["service.title", "service.search_summary", "service.image"],
            ...(isBlog
              ? {
                  fetchLinks: [
                    "author.title",
                    "author.image",
                    "author.linkedin",
                  ],
                }
              : {}),
          })
        ).results.map((doc) => [doc.id, doc] as const)
      : [],
  );

  const items = ids
    .map((id) => docsById.get(id))
    .filter((doc): doc is NonNullable<typeof doc> => Boolean(doc));

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer slice={slice}>
        <StyledSectionTitle
          slice={{
            primary: {
              eyebrow: slice.primary.eyebrow,
              title: slice.primary.title,
              description: slice.primary.description,
            },
          }}
        />

        {items.length > 0 && (
          <ul
            className={clsx(
              "flex flex-wrap justify-center pt-common-space [&>li]:h-auto!",
              isBlog
                ? [
                    "gap-x-5.5 gap-y-6 md:gap-y-8",
                    "[&>li]:w-full sm:[&>li]:w-[calc((100%-1.375rem)/2)] lg:[&>li]:w-[calc((100%-2.75rem)/3)]",
                  ]
                : [
                    "gap-x-4 gap-y-5",
                    "[&>li]:w-full sm:[&>li]:w-[calc((100%-1rem)/2)] lg:[&>li]:w-[calc((100%-2rem)/3)]",
                  ],
            )}
          >
            {items.map((item) =>
              isBlog ? (
                <BlogTemplate
                  key={item.id}
                  item={item as Content.BlogDocument}
                  backgroundColor={slice.primary.background_color}
                />
              ) : (
                <ServiceTemplate
                  key={item.id}
                  item={item as Content.ServiceDocument}
                  backgroundColor={slice.primary.background_color}
                />
              ),
            )}
          </ul>
        )}

        <StyledButtonGroup slice={slice} className="mt-common-space" />
      </StyledContainer>
    </section>
  );
}
