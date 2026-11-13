import { type Content } from "@prismicio/client";
import { type ReactNode } from "react";
import toAbsoluteUrl from "@/utils/toAbsoluteUrl";
import Facebook from "atd-icons/dist/Facebook";
import Instagram from "atd-icons/dist/Instagram";
import Youtube from "atd-icons/dist/Youtube";
import Tiktok from "atd-icons/dist/Tiktok";
import Twitter from "atd-icons/dist/Twitter";
import Linkedin from "atd-icons/dist/Linkedin";

type SocialLinks = Content.SettingsDocument["data"]["social_links"];

interface SocialLinksProps {
  links?: SocialLinks;
}

interface SocialProfile {
  link: string;
  icon: ReactNode;
}

const SocialLinks = ({ links = [] }: SocialLinksProps) => {
  const formattedLinks = getSocialProfiles(links);

  if (!formattedLinks.length) return null;

  return (
    <div className={"flex items-center gap-4"}>
      {formattedLinks.map(({ link, icon }, index) => (
        <a
          href={link}
          target={"_blank"}
          rel={"noreferrer"}
          key={index}
          className="footer-icon"
        >
          {icon}
        </a>
      ))}
    </div>
  );
};

const getSocialProfiles = (links: SocialLinks): SocialProfile[] => {
  const socialLinks: SocialProfile[] = [];
  const size = 28;

  for (const link of links) {
    if (link.link_type !== "Web") continue;
    const { variant, url: rawUrl } = link;
    const url = toAbsoluteUrl(rawUrl);

    switch (variant) {
      case "TikTok":
        socialLinks.push({ link: url, icon: <Tiktok size={size} /> });
        break;
      case "Facebook":
        socialLinks.push({ link: url, icon: <Facebook size={size} /> });
        break;
      case "X (Twitter)":
        socialLinks.push({ link: url, icon: <Twitter size={size} /> });
        break;
      case "Instagram":
        socialLinks.push({ link: url, icon: <Instagram size={size} /> });
        break;
      case "YouTube":
        socialLinks.push({ link: url, icon: <Youtube size={size} /> });
        break;
      case "LinkedIn":
        socialLinks.push({ link: url, icon: <Linkedin size={size} /> });
        break;
    }
  }
  return socialLinks;
};

export default SocialLinks;
