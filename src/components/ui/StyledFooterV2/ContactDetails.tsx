import { type ComponentType } from "react";
import { type Content } from "@prismicio/client";
import clsx from "clsx";
import CallFill from "atd-icons/dist/CallFill";
import AtFill from "atd-icons/dist/AtFill";
import LocationFill from "atd-icons/dist/LocationFill";
import ensureAbsoluteUrl from "@/utils/ensureAbsoluteUrl";

interface ContactDetailsProps {
  settings: Content.SettingsDocument;
  isDark?: boolean;
}

interface ContactDetailsItemProps {
  icon: ComponentType<{ size?: number }>;
  size?: number;
  link?: string | null;
  text: string;
  isDark?: boolean;
  newTab?: boolean;
}

const ContactDetailsItem = ({
  icon: Icon,
  size = 24,
  link,
  text,
  isDark = true,
  newTab = false,
}: ContactDetailsItemProps) => {
  return (
    <li className="flex flex-row gap-x-2.5">
      <span
        className={clsx(
          "w-5 h-5 shrink-0 footer-icon",
          !isDark && "text-text-heading",
        )}
      >
        <Icon size={size} />
      </span>
      {link ? (
        <a
          href={link}
          className="text-body-base"
          {...(newTab
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {text}
        </a>
      ) : (
        <span className="text-body-base">{text}</span>
      )}
    </li>
  );
};

const ContactDetails = ({ settings, isDark = true }: ContactDetailsProps) => {
  const {
    address,
    address_link,
    email_address,
    phone_number_visual,
    phone_number_link,
  } = settings.data;

  const addressLink = ensureAbsoluteUrl(address_link);

  const phoneLink = phone_number_link
    ? phone_number_link.includes("tel:")
      ? phone_number_link
      : `tel:${phone_number_link}`
    : phone_number_link;

  return (
    <ul className="flex flex-col gap-3">
      {phone_number_visual && (
        <ContactDetailsItem
          icon={CallFill}
          link={phoneLink}
          text={phone_number_visual}
          isDark={isDark}
        />
      )}
      {email_address && (
        <ContactDetailsItem
          icon={AtFill}
          link={`mailto:${email_address}`}
          text={email_address}
          isDark={isDark}
        />
      )}
      {address && (
        <ContactDetailsItem
          icon={LocationFill}
          link={addressLink}
          newTab={!!addressLink}
          text={address}
          isDark={isDark}
        />
      )}
    </ul>
  );
};

export default ContactDetails;
