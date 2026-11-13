"use client";
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { type NavItem } from "@/types/nav";
import clsx from "clsx";
import { isBreakpoint } from "@/components/ui/StyledHeader";
import ArrowDown from "atd-icons/dist/ArrowDown";
import { createPortal } from "react-dom";

interface MenuItemProps {
  item: NavItem;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  isLast?: boolean;
  isBreakPointXl?: boolean;
  isBreakPointLg?: boolean;
}

const MenuItem: FC<MenuItemProps> = ({
  item = {},
  setMobileMenuOpen,
  isLast,
  isBreakPointXl = false,
  isBreakPointLg = false,
}) => {
  const { href, target, label, drop } = item;
  const [isOpen, setIsOpen] = useState(false);
  const liRef = useRef<HTMLLIElement>(null);

  const hasDropdown = !!drop?.length;
  const isMegaMenu = (drop?.length ?? 0) > 1;

  const toggleDropdownMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);
  const openMenu = () => setIsOpen(true);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!liRef.current?.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <li
      ref={liRef}
      className={clsx({
        "font-semibold text-slate-800 pointer-events-auto main-nav-item": true,
        "flex flex-col w-full xl:w-auto": true,
        "items-center justify-center": !isLast,
        "items-start mt-4": isLast,
        "xl:mt-0!": isLast && isBreakpoint("xl"),
        "lg:mt-0!": isLast && isBreakpoint("lg"),
        relative: !isMegaMenu,
      })}
    >
      {/* Trigger row */}
      <div className={clsx("flex items-center", { "w-full": !isLast })}>
        <Link
          href={href ?? "/"}
          target={target}
          className={clsx({
            "btn btn-primary": isLast,
            "flex-1 flex items-center": !isLast,
          })}
          onMouseEnter={openMenu}
        >
          <span className="h-12.5 block leading-12.5 whitespace-nowrap">
            {label}
          </span>
        </Link>
        {hasDropdown && (
          <button
            className="p-2"
            onClick={() => {
              toggleDropdownMenu();
            }}
            aria-expanded={isOpen}
            aria-label={`Toggle ${label} submenu`}
          >
            <ArrowDown
              size={16}
              className={clsx("transition-transform duration-200", {
                "rotate-180": isOpen,
              })}
            />
          </button>
        )}
      </div>

      {hasDropdown && (
        <div
          className={clsx({
            "bg-amber-300 top-full  overflow-hidden w-full transition-[opacity,translate,max-h]": true,
            "lg:absolute": isBreakPointLg,
            "xl:absolute": isBreakPointXl,
            "lg:shadow-xl lg:rounded-2xl": !isMegaMenu && isBreakPointLg,
            "xl:shadow-xl xl:rounded-2xl": !isMegaMenu && isBreakPointXl,
            "opacity-0 pointer-events-none -translate-y-2 max-h-0": !isOpen,
            "opacity-100 translate-y-0 pointer-events-auto! max-h-500 z-99":
              isOpen || isMegaMenu,
            "left-0 w-screen": isMegaMenu,
          })}
          onClick={(e) => e.stopPropagation()}
          onMouseLeave={closeMenu}
        >
          <div
            className={clsx("py-2", {
              "flex flex-wrap gap-x-6": isMegaMenu,
            })}
          >
            {drop?.map(({ href: dropHref, links, label: dropLabel }, i) => (
              <div key={i} className={clsx({ "min-w-[140px]": isMegaMenu })}>
                {dropLabel &&
                  (dropHref ? (
                    <Link
                      href={dropHref}
                      className="block font-semibold text-slate-800 mb-1 text-sm px-4"
                      onClick={closeMenu}
                    >
                      {dropLabel}
                    </Link>
                  ) : (
                    <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 px-4">
                      {dropLabel}
                    </span>
                  ))}
                {links?.map((sub, j) => (
                  <Link
                    key={j}
                    href={sub.href ?? "/"}
                    target={sub.target}
                    className="block py-1 px-4 text-sm font-normal text-slate-700"
                    onClick={closeMenu}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </li>
  );
};

export default MenuItem;
