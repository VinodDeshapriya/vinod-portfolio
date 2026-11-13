import { isFilled } from "@prismicio/client";
import PrismicRichTextNormalized from "@/components/ui/PrismicRichTextNormalized";
import StyledButtonGroup from "@/components/ui/StyledButtonGroup";

const BlogCtaBox = ({ settings }) => {
  const title = settings?.data?.title;
  const description = settings?.data?.description;
  const buttons = settings?.data?.buttons;

  if (
    !isFilled.richText(title) &&
    !isFilled.richText(description) &&
    !buttons?.length
  ) {
    return null;
  }

  return (
    <div className="bg-offwhite p-6 flex flex-col gap-3 text-center">
      <PrismicRichTextNormalized
        field={title}
        className="text-title-medium text-text-heading"
      />
      <PrismicRichTextNormalized
        field={description}
        className="text-body-small text-text-description"
      />
      <StyledButtonGroup slice={{ primary: { buttons } }} className="mt-2" />
    </div>
  );
};

export default BlogCtaBox;
