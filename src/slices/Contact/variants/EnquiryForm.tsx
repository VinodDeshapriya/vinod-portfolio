import { Content, asLink, isFilled } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicRichTextNormalized from "@/components/ui/PrismicRichTextNormalized";
import EnquiryFormFields from "../components/EnquiryFormFields";

const DEFAULT_SERVICES = [
  "Commercial Cleaning",
  "Window Cleaning",
  "Carpet Cleaning",
  "Industrial Cleaning",
  "Other",
];

type EnquiryFormProps = {
  slice: Extract<Content.ContactSlice, { variation: "enquiryForm" }>;
};

/**
 * "Enquiry Form" variation of Contact: title, details and map on the left,
 * the enquiry form card on the right (stacked below xl). A successful
 * submission swaps the form for the `success_message` card.
 */
export default function EnquiryForm({ slice }: EnquiryFormProps) {
  const {
    title,
    description,
    contact_details,
    google_map_iframe_url,
    map_image,
    email_recippients,
    services,
    success_message,
    failure_message,
    privacy_policy_link,
    submit_button_label,
  } = slice.primary;

  const serviceOptions = services
    .map((row) => row.label?.trim())
    .filter((label): label is string => Boolean(label));
  const hasMap = Boolean(google_map_iframe_url) || isFilled.image(map_image);

  return (
    <section
      // a button linked to "#contact" scrolls here (one enquiry form per page)
      id="contact"
      className="scroll-mt-20"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer slice={slice}>
        <div className="grid grid-cols-1 gap-(--spacing-space-1) xl:grid-cols-2 xl:gap-12">
          <div className="flex flex-col gap-(--spacing-space-1)">
            <div className="flex flex-col gap-3 text-center xl:text-left">
              <PrismicRichTextNormalized
                field={title}
                className="text-title-2x-large text-text-heading"
              />
              <PrismicRichTextNormalized
                field={description}
                className="text-body-base text-text-description"
              />
            </div>

            {/* Label column is 102/110px in Figma; max-content keeps "Office hours:" on one line */}
            {contact_details.length > 0 && (
              <dl className="grid w-full grid-cols-[minmax(102px,max-content)_1fr] gap-x-4 gap-y-3 md:mx-auto md:max-w-139 md:grid-cols-[minmax(110px,max-content)_1fr] md:gap-x-6.25 xl:mx-0 xl:max-w-none [&_dt]:whitespace-nowrap">
                {contact_details.map((detail, index) => {
                  const href = isFilled.link(detail.value)
                    ? asLink(detail.value)
                    : null;
                  const external = !!href && /^https?:\/\//i.test(href);
                  return (
                    <div key={index} className="contents">
                      <dt className="text-body-base text-text-description">
                        {detail.label}:
                      </dt>
                      <dd className="min-w-0 text-body-base-bold wrap-break-word text-text-heading">
                        {href && href !== "#" ? (
                          <PrismicNextLink
                            field={detail.value}
                            {...(external
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                            className="transition-colors hover:text-primary"
                          />
                        ) : (
                          detail.value?.text
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            )}

            {hasMap && (
              <div className="relative aspect-3/2 w-full overflow-hidden rounded-(--radius-md) bg-offwhite-2 md:mx-auto md:max-w-139 xl:mx-0 xl:aspect-auto xl:min-h-60 xl:max-w-none xl:flex-1">
                {google_map_iframe_url ? (
                  <iframe
                    src={google_map_iframe_url}
                    className="absolute inset-0 size-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Map of our location"
                  />
                ) : (
                  <PrismicNextImage
                    field={map_image}
                    fallbackAlt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 556px, 640px"
                    className="object-cover"
                  />
                )}
              </div>
            )}
          </div>

          <EnquiryFormFields
            services={serviceOptions.length ? serviceOptions : DEFAULT_SERVICES}
            recipients={email_recippients}
            successMessage={success_message}
            failureMessage={failure_message}
            privacyPolicyLink={privacy_policy_link}
            submitLabel={submit_button_label}
          />
        </div>
      </StyledContainer>
    </section>
  );
}
