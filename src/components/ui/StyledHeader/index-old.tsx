"use client";
import { Content } from "@prismicio/client";
import clsx from "clsx";
import { type NavItem } from "@/types/nav";
import StyledContainer from "../StyledContainer";
import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";
import MenuFill from "atd-icons/dist/MenuFill";
import CloseFill from "atd-icons/dist/CloseFill";
import { useState, useEffect, useRef } from "react";
import AlgoliaSearchModal from "../AlgoliaSearch/AlgoliaSearchModal";
import MenuItem from "@/slices-nav/MenuItem";

const BREAKPOINT = "lg";

export const isBreakpoint = (bp = "lg") => {
  return BREAKPOINT === bp;
};

interface StyledHeaderProps {
  settings?: Content.SettingsDocument;
  mainMenu?: NavItem[];
}

const StyledHeader = ({ settings, mainMenu }: StyledHeaderProps) => {
  const [stickyMenu, setStickyMenu] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 10) {
        setStickyMenu(true);
      } else if (currentScrollY < lastScrollY.current) {
        setStickyMenu(true);
      } else if (currentScrollY > lastScrollY.current) {
        setStickyMenu(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const closeMobileMenu = () => setMobileMenuOpen(false);

  /**
   * DO NOT ADD ANY STYLES THAT CHANGE THE HEIGHT OF THIS HEADER TAG
   * CHANGING THE HEIGHT DURING STICKY HAS A BUG THAT MAKE THE PAGE SCROLL BACK AND FORTH !!!
   */
  return (
    <header
      className={clsx({
        "py-3 lg:py-4 z-50 bg-white transition-all relative shadow-[0_10px_60px_-10px_rgba(0,0,0,0.2)]": true,
        "-top-40": !stickyMenu,
        "top-0 ": stickyMenu,
      })}
    >
      <StyledContainer className="flex! justify-between!">
        <Link href="/">
          <PrismicNextImage
            field={settings?.data.header_logo}
            fallbackAlt=""
            className="h-12.5 w-auto object-contain"
          />
        </Link>

        <button
          className={clsx({
            "flex items-center": true,
            "xl:hidden": isBreakpoint("xl"),
            "lg:hidden": isBreakpoint("lg"),
          })}
          aria-label="Open mobile menu"
        >
          <MenuFill
            size={24}
            className="ms-4 text-2xl cursor-pointer"
            onClick={toggleMenu}
          />
        </button>

        <div
          className={clsx({
            "fixed h-screen w-screen ms-auto z-100 top-0 right-0 bg-[rgba(0,0,0,0.5)]  transition-all  ease-linear": true,
            "xl:transition-none xl:static xl:opacity-100 xl:bg-transparent xl:block xl:w-auto xl:h-auto":
              isBreakpoint("xl"),
            "lg:transition-none lg:static lg:opacity-100 lg:bg-transparent lg:block lg:w-auto lg:h-auto":
              isBreakpoint("lg"),
            "opacity-100": mobileMenuOpen,
            "opacity-0 pointer-events-none delay-200": !mobileMenuOpen,
            "xl:pointer-events-auto": isBreakpoint("xl") && !mobileMenuOpen,
            "lg:pointer-events-auto": isBreakpoint("lg") && !mobileMenuOpen,
          })}
          onClick={closeMobileMenu}
        >
          <nav
            className={clsx({
              "bg-white min-h-screen w-62 ms-auto transition-transform ease-linear pointer-events-auto": true,
              "xl:transition-none! xl:translate-x-0! xl:w-auto xl:min-h-0":
                isBreakpoint("xl"),
              "lg:transition-none! lg:translate-x-0! lg:w-auto lg:min-h-0":
                isBreakpoint("lg"),
              "translate-x-0 delay-200": mobileMenuOpen,
              "translate-x-full": !mobileMenuOpen,
            })}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={clsx({
                "text-right": true,
                "xl:hidden xl:none": isBreakpoint("xl"),
                "lg:hidden lg:none": isBreakpoint("lg"),
              })}
            >
              <button
                onClick={closeMobileMenu}
                className={clsx({
                  "p-4 md:me-6": true,
                })}
              >
                <CloseFill size={24} />
              </button>
            </div>
            <ul
              className={clsx({
                "bg-amber-150 gap-6 md:gap-10 p-4 ": true,
                "xl:flex 2xl:flex-wrap xl:p-0": isBreakpoint("xl"),
                "lg:flex xl:flex-wrap lg:p-0": isBreakpoint("lg"),
              })}
            >
              {mainMenu?.map((item, idx) => {
                return (
                  <MenuItem
                    key={idx}
                    item={item}
                    setMobileMenuOpen={setMobileMenuOpen}
                    isLast={idx === mainMenu?.length - 1}
                    isBreakPointLg={isBreakpoint("lg")}
                    isBreakPointXl={isBreakpoint("xl")}
                  />
                );
              })}
              <AlgoliaSearchModal />
            </ul>
          </nav>
        </div>
      </StyledContainer>
      <div id="mega-menu"></div>
    </header>
  );
};

export default StyledHeader;
