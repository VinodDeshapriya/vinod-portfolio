import { LinkField, asLink } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";

export interface ContactDetailItem {
  label?: string;
  value?: LinkField;
}

interface ContactDetailsTableProps {
  items: ContactDetailItem[];
}

const resolveHref = (value?: LinkField) => {
  const href = value ? asLink(value) : null;
  return href && href !== "#" ? href : null;
};

const isExternalLink = (value?: LinkField) => {
  const href = resolveHref(value);
  return !!href && /^https?:\/\//i.test(href);
};

const ContactDetailsTable = ({ items }: ContactDetailsTableProps) => {
  if (!items || items.length === 0) return null;

  return (
    <table className="border-separate border-spacing-y-3 w-fit sm:min-w-120 max-w-[556px] mx-auto xl:mx-0 xl:max-w-none xl:max-full xl:min-w-auto table-fixed">
      <tbody>
        {items.map((detail, idx) => (
          <tr key={idx}>
            <td className="text-body-base text-text-secondary whitespace-nowrap pr-6 align-top w-32">
              {detail.label}:
            </td>
            <td className="text-body-base-bold align-top wrap-break-word">
              {resolveHref(detail.value) ? (
                <PrismicNextLink
                  field={detail.value}
                  {...(isExternalLink(detail.value)
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="hover:text-primary transition-colors"
                />
              ) : (
                detail.value?.text
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactDetailsTable;
