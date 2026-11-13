"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { asLink, type Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import clsx from "clsx";
import Add from "atd-icons/dist/Add";
import Remove from "atd-icons/dist/Remove";

interface FooterMenuColumnProps {
  menu: Content.MenuDocument | undefined;
  isDark?: boolean;
}

const FooterMenuColumn = ({ menu, isDark = true }: FooterMenuColumnProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const pathname = usePathname();

  if (!menu?.data.links?.length) return null;

  return (
    <div className="xl:min-w-[201px]">
      {menu.data.title && (
        <h5
          className={clsx(
            "text-[20px] leading-[24px] font-medium mb-3",
            !isDark && "text-text-heading",
          )}
        >
          {menu.data.title}
        </h5>
      )}
      <ul className="flex flex-col gap-3">
        {menu.data.links.map(({ link, sub_links }, idx) => {
          const hasSubLinks = !!sub_links?.length;
          const isOpen = openIndex === idx;
          const isActive = pathname === asLink(link);

          return (
            <li key={idx}>
              <div className="flex items-center gap-x-2">
                <PrismicNextLink
                  field={link}
                  className={clsx(
                    "text-body-base underline-offset-2",
                    !isDark && "text-text-heading hover:text-secondary-light",
                    isActive ? "underline" : "no-underline",
                  )}
                />
                {hasSubLinks && (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={`Toggle ${link.text ?? "submenu"}`}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex items-center gap-x-0.5"
                  >
                    <span>[</span>
                    {isOpen ? <Remove size={14} /> : <Add size={14} />}
                    <span>]</span>
                  </button>
                )}
              </div>
              {hasSubLinks && (
                <div
                  className="grid transition-[grid-template-rows] duration-400 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden min-h-0">
                    <ul className="flex flex-col gap-3 pt-3 ps-4">
                      {sub_links.map((subLink, subIdx) => {
                        const isSubActive = pathname === asLink(subLink);

                        return (
                          <li key={subIdx}>
                            <PrismicNextLink
                              field={subLink}
                              className={clsx(
                                "text-body-base underline-offset-2",
                                !isDark && "text-text-heading",
                                isSubActive ? "underline" : "no-underline",
                              )}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FooterMenuColumn;
