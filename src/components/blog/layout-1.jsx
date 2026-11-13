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

const BlogLayout1 = ({ page, settings }) => {
  return (
    <>
      <Breadcrumbs page={page} />
      <StyledContainer
        className="max-w-[846px]!"
        parentClassName="pt-(--spacing-vertical-padding-half)! pb-(--spacing-vertical-padding-full)!"
      >
        <ArticleHeader page={page} />

        <ArticleHero page={page} />

        <div className="my-7 md:my-8">
          <div className="text-secondary-dark text-title-medium">
            Table of content
          </div>
          <TableOfContents page={page} />
        </div>
        <ArticleBody page={page} settings={settings} />
        <div className="mt-6 md:mt-7">
          <ArticleShare page={page} />
        </div>
      </StyledContainer>
      <ArticleRestSlices page={page} settings={settings} />
    </>
  );
};

export default BlogLayout1;
