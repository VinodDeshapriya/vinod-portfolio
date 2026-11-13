import { FC } from "react";
import { Content, LinkField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicRichText from "@/components/ui/PrismicRichText";
import PrismicRichTextNormalized from "@/components/ui/PrismicRichTextNormalized";
import ContactDetailsTable, {
  ContactDetailItem,
} from "./components/ContactDetailsTable";
import SocialLinks, { SocialLinkItem } from "./components/SocialLinks";
import ContactForm from "./ContactForm";
import EnquiryForm from "./variants/EnquiryForm";
import clsx from "clsx";

/**
 * Props for `Contact`.
 */
export type ContactProps = SliceComponentProps<Content.ContactSlice>;

/**
 * Component for "Contact" Slices.
 */
const Contact: FC<ContactProps> = ({ slice }) => {
  if (slice.variation === "enquiryForm") {
    return <EnquiryForm slice={slice} />;
  }

  const primary = slice.primary as typeof slice.primary & {
    contact_details?: ContactDetailItem[];
    social_links?: SocialLinkItem[];
    privacy_policy_link?: LinkField;
    submit_button_label?: string;
  };

  const {
    google_map_iframe_url,
    full_width_map,
    email_recippients,
    success_message,
    failure_message,
    contact_details,
    social_links,
    privacy_policy_link,
    submit_button_label,
  } = primary;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer slice={slice}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-7 md:gap-8 xl:gap-5 xl:px-[108px]">
          {/* Left: Contact info */}
          <div className="flex flex-col gap-7 md:gap-8 xl:gap-10">
            <div>
              <PrismicRichTextNormalized
                field={slice.primary.title}
                className="text-title-2x-large text-center xl:text-left"
              />
              <PrismicRichTextNormalized
                field={slice.primary.description}
                className="text-body-medium text-center xl:text-left"
              />
            </div>

            {contact_details && <ContactDetailsTable items={contact_details} />}

            {social_links && <SocialLinks items={social_links} />}
          </div>

          {/* Right: Contact form */}
          <ContactForm
            recipients={email_recippients}
            successMessage={success_message}
            failureMessage={failure_message}
            privacyPolicyLink={privacy_policy_link}
            submitLabel={submit_button_label}
          />
        </div>
        {/* Map */}
        {google_map_iframe_url && (
          <div
            className={clsx({
              "mt-7 md:mt-8 xl:mt-10": true,
              "w-full": full_width_map,
              "px-[16px] md:px-[40px] xl:px-[80px]": !full_width_map,
            })}
          >
            <div
              className={`rounded-md overflow-hidden ${
                full_width_map ? "w-full" : "mx-auto w-full max-w-[1280px]"
              }`}
            >
              <iframe
                src={google_map_iframe_url}
                width="100%"
                height="450"
                className="border-0 block"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
            </div>
          </div>
        )}
      </StyledContainer>
    </section>
  );
};

export default Contact;
