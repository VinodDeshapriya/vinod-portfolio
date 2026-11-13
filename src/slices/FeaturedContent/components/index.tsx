import { RichTextField } from "@prismicio/client";
import PrismicRichText from "@/components/ui/PrismicRichText";
import PrismicRichTextNormalized from "@/components/ui/PrismicRichTextNormalized";

export const FeatureTitle = ({ content }: { content: RichTextField }) => (
  <PrismicRichTextNormalized
    field={content}
    className="text-title-medium mb-3"
  />
);

export const FeatureDescription = ({
  content,
}: {
  content: RichTextField | undefined;
}) => (
  <PrismicRichText
    field={content}
    components={{
      paragraph: ({ children }) => (
        <p className="text-body-base mb-7 last:mb-0">{children}</p>
      ),
    }}
  />
);

export const FeatureEyebrow = ({ content }: { content: RichTextField }) => (
  <PrismicRichTextNormalized
    field={content}
    className="text-title-base-blog mb-2"
  />
);
