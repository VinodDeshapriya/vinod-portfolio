import { type RichTextField } from "@prismicio/client";
import { Accordion } from "./Accordion";

interface FaqItem {
  question: RichTextField;
  answer: RichTextField;
}

interface QuestionBlocksProps {
  list: FaqItem[];
  sliceId: string;
  sectionHasBackground?: boolean;
}

const QuestionBlocks = ({
  list,
  sliceId,
  sectionHasBackground,
}: QuestionBlocksProps) => {
  return (
    <div className="space-y-3">
      {list.map(({ question, answer }, idx) => (
        <Accordion
          key={idx}
          title={question}
          content={answer}
          sliceId={sliceId}
          defaultOpen={idx === 0}
          sectionHasBackground={sectionHasBackground}
        />
      ))}
    </div>
  );
};

export default QuestionBlocks;
