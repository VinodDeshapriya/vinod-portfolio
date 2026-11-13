import { isFilled, type Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";

interface LegalLinksProps {
  menu: Content.MenuDocument | null | undefined;
}

const LegalLinks = ({ menu }: LegalLinksProps) => {
  const links = menu?.data.links
    ?.flatMap(({ link, sub_links }) => [link, ...(sub_links ?? [])])
    .filter(isFilled.link);

  if (!links?.length) return null;

  return (
    <ul className="flex items-center justify-center md:justify-start gap-x-4 lg:justify-end text-[14px] leading-[22px]">
      {links.map((link, index) => (
        <li key={index} className="flex items-center gap-x-4">
          {index > 0 && <span aria-hidden>|</span>}
          <PrismicNextLink
            field={link}
            className="decoration-transparent hover:decoration-current underline-offset-2 transition-colors duration-200 hover:underline"
          />
        </li>
      ))}
    </ul>
  );
};

export default LegalLinks;
