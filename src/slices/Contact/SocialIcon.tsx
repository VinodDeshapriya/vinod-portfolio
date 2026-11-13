import dynamic from "next/dynamic";

const icons = {
  Facebook: dynamic(() => import("atd-icons/dist/Facebook")),
  Twitter: dynamic(() => import("atd-icons/dist/Twitter")),
  Youtube: dynamic(() => import("atd-icons/dist/Youtube")),
  Tiktok: dynamic(() => import("atd-icons/dist/Tiktok")),
  Linkedin: dynamic(() => import("atd-icons/dist/Linkedin")),
  Instagram: dynamic(() => import("atd-icons/dist/Instagram")),
} as const;

export type SocialIconName = keyof typeof icons;

const SocialIcon = ({
  name,
  size = 24,
}: {
  name: SocialIconName;
  size?: number;
}) => {
  const Icon = icons[name];
  return <Icon size={size} />;
};

export default SocialIcon;
