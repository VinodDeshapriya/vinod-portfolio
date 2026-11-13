import { RichTextField, isFilled } from "@prismicio/client";
import { CloseCircle } from "atd-icons";
import PrismicRichText from "@/components/ui/PrismicRichText";

interface EnquiryFormErrorProps {
  message: RichTextField;
  onReset: () => void;
}

/**
 * "Unsuccessful submission" card from the Enquiry Form design.
 */
const EnquiryFormError = ({ message, onReset }: EnquiryFormErrorProps) => (
  <div
    role="alert"
    className="flex flex-col items-center gap-8 rounded-(--radius-md) bg-white px-4 py-6 text-center md:p-10"
  >
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <CloseCircle size={60} color="#F5222D" />
        {/* title/large is 450 in Figma; the class is 600 and unlayered, hence `!` */}
        <h3 className="text-title-large font-[450]! text-text-heading">
          We couldn&apos;t submit your enquiry
        </h3>
      </div>
      {isFilled.richText(message) && (
        <div className="text-body-large text-text-description [&_a]:underline [&_p:not(:last-child)]:mb-3">
          <PrismicRichText field={message} />
        </div>
      )}
    </div>
    <div className="flex w-full flex-col gap-3">
      <p className="text-body-large text-text-description">
        Return to the Contact Form
      </p>
      <button
        type="button"
        onClick={onReset}
        className="btn btn-primary text-body-base-bold w-full justify-center"
      >
        Resubmit Inquiry
      </button>
    </div>
  </div>
);

export default EnquiryFormError;
