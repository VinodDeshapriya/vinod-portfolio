import { type Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceZone } from "@prismicio/react";
import clsx from "clsx";
import SocialLinks from "./SocialLinks";
import CopyrightLinks from "./CopyrightLinks";
import LegalLinks from "./LegalLinks";
import FooterMenuColumn from "./FooterMenuColumn";
import ContactDetails from "./ContactDetails";
import NewsletterForm from "./NewsletterForm";
import StyledContainer from "../StyledContainer";
import { components as footerSliceComponents } from "@/slices-footer";

interface StyledFooterProps {
  settings: Content.SettingsDocument;
  menus: Content.MenuDocument[];
  isDark?: boolean;
}

export default async function StyledFooterV2({
  settings,
  menus,
  isDark = true,
}: StyledFooterProps) {
  const aboutMenu = menus?.find(({ uid }) => uid === "about");
  const servicesMenu = menus?.find(({ uid }) => uid === "footer_menu_services");
  const quickLinksMenu = menus?.find(
    ({ uid }) => uid === "footer_menu_quick_links",
  );
  const legalMenu = menus?.find(({ uid }) => uid === "footer-copyright-links");

  return (
    <footer
      className={clsx(isDark ? "site-footer" : "bg-white text-text-heading")}
    >
      <StyledContainer className="py-8 md:py-10 xl:py-15 overflow-hidden">
        <div className="flex flex-col gap-y-10 xl:flex-row xl:items-start xl:justify-between">
          {/* Column 1 — Company info & legal */}
          <div className="xl:max-w-87.5">
            <PrismicNextImage
              field={settings.data.footer_logo}
              fallbackAlt=""
            />
            <p className="text-body-base mt-[18px] mb-6">
              {settings.data.footer_description}
            </p>
            <ContactDetails settings={settings} isDark={isDark} />
          </div>

          <div className="flex flex-col xl:flex-row xl:items-start gap-y-10 xl:shrink-0">
            {/* Column 2 — CMS-driven Services & Quick Links menus */}
            <div className="grid md:grid-cols-2 gap-6">
              <FooterMenuColumn menu={servicesMenu} isDark={isDark} />
              <FooterMenuColumn menu={quickLinksMenu} isDark={isDark} />
            </div>

            {/* Column 3 — Map, opening hours & description (CMS-driven via footer menu docs) */}
            <div className="xl:w-86 grid md:grid-cols-2 gap-6 xl:md:gap-8 xl:grid-cols-1">
              <div className="">
                <p className="text-[20px] leading-[24px] font-title font-medium mb-3">
                  Follow us on
                </p>
                <SocialLinks links={settings.data.social_links} />
              </div>
              <NewsletterForm isDark={isDark} />
            </div>
          </div>
        </div>

        <div
          className={clsx(
            isDark ? "border-t-border-primary" : "border-t-border-secondary",
            "border-t mt-6 text-body-base md:mt-8 xl:mt-10 pt-3",
          )}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-[14px] leading-[22px] max-w-fit text-center md:text-left">
              <span className="inline-block">
                &copy; {new Date().getFullYear()} {settings.data.copyright_text}
              </span>
              <CopyrightLinks menu={aboutMenu} />
              <span className="mx-2">|</span>
              <a
                href="https://atdigital.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-transparent hover:decoration-current underline-offset-2 transition-colors duration-200"
              >
                Website design and development - AT Digital
              </a>
            </div>
            <LegalLinks menu={legalMenu} />
          </div>
        </div>
      </StyledContainer>
    </footer>
  );
}
