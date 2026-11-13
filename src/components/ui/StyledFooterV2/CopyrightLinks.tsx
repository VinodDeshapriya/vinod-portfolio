import { type Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";

interface CopyrightLinksProps {
  menu: Content.MenuDocument | null | undefined;
}

const CopyrightLinks = ({ menu }: CopyrightLinksProps) => {
  if (!menu?.data.links?.length) return null;

  return (
    <ul
      className={
        "ms-2 flex flex-col gap-y-[6px] md:gap-y-0  md:flex-row md:gap-x-[30px]"
      }
    >
      {menu.data.links.map(({ link }, index) => (
        <li key={index}>
          <PrismicNextLink field={link} />
        </li>
      ))}
    </ul>
  );
};

export default CopyrightLinks;
