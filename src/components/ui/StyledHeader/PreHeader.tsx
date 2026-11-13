import { Content } from "@prismicio/client";
import MailFill from "atd-icons/dist/MailFill";
import LocationFill from "atd-icons/dist/LocationFill";
import StyledContainer from "../StyledContainer";
import ensureAbsoluteUrl from "@/utils/ensureAbsoluteUrl";

interface PreHeaderProps {
  settings?: Content.SettingsDocument;
}

const PreHeader = ({ settings }: PreHeaderProps) => {
  const { email_address, address, address_link } = settings?.data ?? {};
  const addressLink = ensureAbsoluteUrl(address_link);

  if (!email_address && !address) return null;

  return (
    <div className="bg-primary-light">
      <StyledContainer>
      <div className="mx-auto flex w-full items-center justify-center md:justify-end gap-9 py-1.5 md:py-3 text-body-base text-white">
        {email_address && (
          <a
            href={`mailto:${email_address}`}
            className="hidden md:flex items-center gap-2 hover:opacity-80"
          >
            <MailFill size={18} className="shrink-0" />
            {email_address}
          </a>
        )}
      
        {address &&
          (addressLink ? (
            <a
              href={addressLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 text-body-base"
            >
              <LocationFill size={18} className="shrink-0" />
              {address}
            </a>
          ) : (
            <span className="flex items-center gap-2 text-body-base">
              <LocationFill size={18} className="shrink-0" />
              {address}
            </span>
          ))}
      </div>
      </StyledContainer>
    </div>
  );
};

export default PreHeader;
