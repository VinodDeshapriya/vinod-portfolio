import { LinkField } from "@prismicio/client";
import SocialIcon, { SocialIconName } from "../SocialIcon";
import toAbsoluteUrl from "@/utils/toAbsoluteUrl";

export interface SocialLinkItem {
  platform?:
    | "Facebook"
    | "X"
    | "YouTube"
    | "TikTok"
    | "LinkedIn"
    | "Instagram";
  url?: LinkField;
}

const SOCIAL_ICON_MAP: Record<string, string> = {
  Facebook: "Facebook",
  X: "Twitter",
  YouTube: "Youtube",
  TikTok: "Tiktok",
  LinkedIn: "Linkedin",
  Instagram: "Instagram",
};

interface SocialLinksProps {
  items: SocialLinkItem[];
}

const SocialLinks = ({ items }: SocialLinksProps) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex items-center flex-wrap max-w-[556px] xl:max-w-none">
      <span className="text-body-base text-text-secondary block w-32">
        Follow us on
      </span>
      <div className="flex items-center gap-3">
        {items.map((item, idx) => {
          if (!item.platform) return null;
          const iconName = SOCIAL_ICON_MAP[item.platform];
          const href = toAbsoluteUrl(
            item.url && "url" in item.url
              ? (item.url as { url: string }).url
              : "#",
          );
          const target =
            item.url && "target" in item.url
              ? ((item.url as { target?: string }).target as
                  | "_blank"
                  | undefined)
              : undefined;
          return (
            <a
              key={idx}
              href={href}
              target={target}
              rel={target === "_blank" ? "noopener noreferrer" : undefined}
              aria-label={item.platform}
              className="text-text-primary hover:text-primary transition-colors"
            >
              <SocialIcon name={iconName as SocialIconName} size={24} />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinks;
