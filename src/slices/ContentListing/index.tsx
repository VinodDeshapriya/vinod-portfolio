import { Content, asLink, filter, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import clsx from "clsx";
import { Suspense } from "react";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";
import { createClient } from "@/prismicio";
import dynamic from "next/dynamic";
import StyledPagination from "./StyledPagination";
import BlogFilterBar from "./BlogFilterBar";
import EmptyState from "./EmptyState";

const client = createClient();

const ServiceTemplate = dynamic(() => import("./templates/ServiceTemplate"));
const AuthorTemplate = dynamic(() => import("./templates/AuthorTemplate"));

type ContentListingContext = {
  currentPage: number;
  firstPage: string | null;
  settings: Content.SettingsDocument;
  category?: string | null;
};

/**
 * Props for `ContentListing`.
 */
export type ContentListingProps = SliceComponentProps<
  Content.ContentListingSlice,
  ContentListingContext
>;

/**
 * Component for "ContentListing" Slices.
 */
export default async function ContentListing({
  slice,
  context,
}: ContentListingProps) {
  const { currentPage, settings, category } = context;

  const contentType = slice.primary.content_type;
  const type = getType(contentType);

  if (!type) return null;

  const repeatableType = settings?.data?.repeatable_types?.find(
    (t) => t?.type === type,
  );

  const pageSize = repeatableType?.items_per_page || 10;

  const firstPage = asLink(repeatableType?.parent_page) || "/";

  const categories =
    contentType === "Blog"
      ? await client.getAllByType("blog_categories", {
          orderings: { field: "my.blog_categories.order", direction: "asc" },
          fetch: ["blog_categories.title"],
        })
      : [];

  const tags =
    contentType === "Blog"
      ? await client.getAllByType("blog_tag", {
          fetch: ["blog_tag.tag_name"],
        })
      : [];

  // Only surface categories/tags that are actually assigned to at least one
  // blog post — otherwise the filter has nothing meaningful to filter.
  let visibleCategories: Content.BlogCategoriesDocument[] = [];
  let visibleTags: Content.BlogTagDocument[] = [];

  if (contentType === "Blog" && (categories.length > 0 || tags.length > 0)) {
    try {
      const allBlogs = await client.getAllByType("blog", {
        fetch: ["blog.category", "blog.tags"],
      });

      const usedCategoryIds = new Set(
        allBlogs
          .map((b) => b.data.category)
          .filter(isFilled.contentRelationship)
          .map((c) => c.id),
      );

      const usedTagIds = new Set(
        allBlogs
          .flatMap((b) => b.data.tags)
          .map((t) => t.tag)
          .filter(isFilled.contentRelationship)
          .map((t) => t.id),
      );

      visibleCategories = categories.filter((c) => usedCategoryIds.has(c.id));
      visibleTags = tags.filter((t) => usedTagIds.has(t.id));
    } catch {
      // The `category`/`tags` fields may not be published to the Prismic
      // repository yet (custom type change pending a Slice Machine push).
      // Fall back to hiding the filters rather than breaking the listing.
      visibleCategories = [];
      visibleTags = [];
    }
  }

  const activeCategory = visibleCategories.find((c) => c.uid === category);

  const paginationFirstPage = activeCategory
    ? `${firstPage}/category/${activeCategory.uid}`
    : firstPage;

  const items = await client.getByType(type, {
    page: currentPage,
    pageSize: pageSize,
    fetch: [
      `${type}.title`,
      `${type}.summary`,
      `${type}.search_summary`,
      `${type}.image`,
      `${type}.publisher`,
      `${type}.publish_date`,
    ],
    fetchLinks: ["author.title", "author.image", "author.linkedin"],
    orderings: {
      field: "my.blog.publish_date",
      direction: "desc",
    },
    ...(activeCategory
      ? { filters: [filter.at("my.blog.category", activeCategory.id)] }
      : {}),
  });

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer slice={slice}>
        <StyledSectionTitle slice={slice} wrapperClassName="max-w-[846px]!" />

        {contentType === "Blog" ? (
          <Suspense fallback={null}>
            <BlogFilterBar
              categories={visibleCategories}
              tags={visibleTags}
              initialItems={items.results as Content.BlogDocument[]}
              initialTotalPages={items.total_pages}
              initialPage={items.page}
              initialCategoryUid={activeCategory?.uid ?? null}
              basePath={firstPage}
              initialFirstPage={paginationFirstPage}
              pageSize={pageSize}
              backgroundColor={slice.primary.background_color}
            />
          </Suspense>
        ) : (
          <>
            {items?.results?.length ? (
              <ul
                className={clsx(
                  "grid pt-common-space",
                  contentType === "Authors"
                    ? "sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-[repeat(auto-fit,minmax(0,405px))] justify-center"
                    : "sm:grid-cols-2 lg:grid-cols-3",
                  "gap-x-7 gap-y-7 md:gap-8",
                )}
              >
                {items.results.map((item) => {
                  switch (contentType) {
                    case "Authors":
                      return (
                        <AuthorTemplate
                          key={item.id}
                          item={item as Content.AuthorDocument}
                          backgroundColor={slice.primary.background_color}
                        />
                      );
                    default:
                      return (
                        <ServiceTemplate
                          key={item.id}
                          item={item as Content.ServiceDocument}
                          backgroundColor={slice.primary.background_color}
                        />
                      );
                  }
                })}
              </ul>
            ) : (
              <EmptyState
                title={`No ${contentType === "Authors" ? "authors" : "services"} found`}
                description="Please check back soon — new content is on its way."
              />
            )}

            <StyledPagination
              totalPageCount={items.total_pages}
              currentPage={items.page}
              firstPage={paginationFirstPage ?? undefined}
            />
          </>
        )}
      </StyledContainer>
    </section>
  );
}

const getType = (
  contentType: Content.ContentListingSliceDefaultPrimary["content_type"],
) => {
  switch (contentType) {
    case "Blog":
      return "blog";
    case "Services":
      return "service";
    case "Authors":
      return "author";
    default:
      return null;
  }
};
