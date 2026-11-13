import { createClient } from "@/prismicio";
import { asLink, isFilled } from "@prismicio/client";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import StyledContainer from "@/components/ui/StyledContainer";
import {
  ArticleHeader,
  ArticleHero,
  TableOfContents,
  ArticleBody,
  ArticleRestSlices,
  ArticleShare,
} from "./BlogArticleContent";
import BlogCategoriesSidebar from "./BlogCategoriesSidebar";
import BlogCtaBox from "./BlogCtaBox";

const client = createClient();

const BlogLayout2 = async ({ page, settings }) => {
  const repeatableType = settings?.data?.repeatable_types?.find(
    (t) => t?.type === "blog",
  );
  const basePath = asLink(repeatableType?.parent_page) || "/blog";

  const categories = await client.getAllByType("blog_categories", {
    orderings: { field: "my.blog_categories.order", direction: "asc" },
    fetch: ["blog_categories.title"],
  });

  let visibleCategories = [];

  if (categories.length > 0) {
    try {
      const allBlogs = await client.getAllByType("blog", {
        fetch: ["blog.category"],
      });

      const usedCategoryIds = new Set(
        allBlogs
          .map((b) => b.data.category)
          .filter(isFilled.contentRelationship)
          .map((c) => c.id),
      );

      visibleCategories = categories.filter((c) => usedCategoryIds.has(c.id));
    } catch {
      visibleCategories = [];
    }
  }

  const showCategories = visibleCategories.length > 1;

  const postCategory = page.data.category;
  const activeCategoryUid =
    isFilled.contentRelationship(postCategory) &&
    visibleCategories.some((c) => c.id === postCategory.id)
      ? postCategory.uid
      : null;

  return (
    <>
      <Breadcrumbs page={page} />

      <StyledContainer
        className="max-w-[1280px]!"
        parentClassName="pt-(--spacing-vertical-padding-half)!"
      >
        <ArticleHeader page={page} />
      </StyledContainer>

      <StyledContainer
        className="max-w-[1280px]!"
        parentClassName="pt-(--spacing-vertical-padding-half)! pb-(--spacing-vertical-padding-full)!"
      >
        <div className="grid gap-7 xl:gap-8 xl:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] items-start">
          <div className="min-w-0">
            <ArticleHero page={page} />

            <div className="my-7 md:my-8">
              <div className="text-secondary-dark text-title-medium">
                Table of content
              </div>
              <TableOfContents page={page} />
            </div>

            <div className="grid gap-7 md:gap-8 blog-page-content">
              <ArticleBody page={page} settings={settings} />
            </div>

            <ArticleShare page={page} className="mt-7 md:mt-8" />
          </div>

          <div className="flex flex-col gap-6 xl:gap-7 xl:sticky xl:top-[20px]">
            {showCategories && (
              <BlogCategoriesSidebar
                categories={visibleCategories}
                activeCategoryUid={activeCategoryUid}
                basePath={basePath}
              />
            )}
            <BlogCtaBox settings={settings} />
          </div>
        </div>
      </StyledContainer>

      <ArticleRestSlices page={page} settings={settings} />
    </>
  );
};

export default BlogLayout2;
