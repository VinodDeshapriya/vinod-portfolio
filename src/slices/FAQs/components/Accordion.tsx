import { type RichTextField } from "@prismicio/client";
import clsx from "clsx";
import PrismicRichText from "@/components/ui/PrismicRichText";
import PrismicRichTextNormalized from "@/components/ui/PrismicRichTextNormalized";
import ChevronDown from "atd-icons/dist/ChevronDown";

export interface AccordionProps {
  title: RichTextField;
  content: RichTextField;
  sliceId: string;
  defaultOpen?: boolean;
  sectionHasBackground?: boolean;
}

export function Accordion({
  title,
  content,
  sliceId,
  defaultOpen,
  sectionHasBackground,
}: AccordionProps) {
  return (
    <details
      name={`faq-${sliceId}`}
      open={defaultOpen}
      className={clsx(
        "group border bg-white border-border-primary rounded-(--radius-md) transition-colors duration-300",
        // Tint the open card only when the section itself has no background.
        !sectionHasBackground && "open:bg-offwhite",
      )}
    >
      {/* summary is the only clickable element; list-none hides the default browser arrow */}
      <summary className="flex flex-row items-start justify-between gap-4 cursor-pointer px-6 py-7.5 select-none list-none [&::-webkit-details-marker]:hidden">
        <PrismicRichTextNormalized field={title} className="text-title-base" />
        <ChevronDown
          size={18}
          className="shrink-0 transition-transform duration-300 group-open:rotate-180 mt-1"
        />
      </summary>

      <div className="px-6 pb-6">
        <PrismicRichText field={content} />
      </div>
    </details>
  );
}
