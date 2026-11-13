import { RichTextField } from "@prismicio/client";
import PrismicRichText from "@/components/ui/PrismicRichText";
import StyledButton from "@/components/ui/StyledButton";
import { CloseCircle } from "atd-icons";

interface ContactFormErrorProps {
  message: RichTextField;
  onReset: () => void;
}

const ContactFormError = ({ message, onReset }: ContactFormErrorProps) => {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm text-center flex items-center justify-center flex-col">
      <div className="mb-6 flex flex-col items-center">
        <CloseCircle size={60} color="#F5222D" />
        <h3 className="text-title-large">Unsuccessful Submission</h3>
      </div>
      <div className="mb-6 [&_p]:text-[16px]! [&_p]:md:text-[18px]! [&_p]:leading-[24px]! [&_p]:md:leading-[28px]!">
        <PrismicRichText field={message}/>
      </div>
      <div className="w-full">
        <p className="text-body-base mb-3">Return to the Contact Form</p>
        <StyledButton
          type="button"
          variant="Primary"
          onClick={onReset}
          className="w-full justify-center"
        >
          Resubmit Inquiry
        </StyledButton>
      </div>
    </div>
  );
};

export default ContactFormError;
