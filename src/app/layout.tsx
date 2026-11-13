import type { Metadata } from "next";
import dynamic from "next/dynamic";
import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";
import StyledHeader from "@/components/ui/StyledHeader";
import { type NavItem } from "@/types/nav";
import { fontVariables } from "./fonts";

import "./globals.css";

const StyledFooter = dynamic(() => import("@/components/ui/StyledFooter"));
const StyledFooterV2 = dynamic(() => import("@/components/ui/StyledFooterV2"));

export const metadata: Metadata = {
  title: "Welcome",
};

const client = createClient();
const settings = await client.getSingle("settings");
const mainMenuDoc = await client.getSingle("main_menu");
const menus = await client.getAllByType("menu");

const mainMenu: NavItem[] = mainMenuDoc.data.slices.map(({ primary }) => {
  const { link, sublinks } = primary;
  return {
    href: prismic.asLink(link),
    label: link?.text,
    target: link?.link_type === "Web" ? link.target : undefined,
    drop: sublinks
      ?.map(({ title_link, links }) => {
        const titleLinks = Array.isArray(title_link) ? title_link : [];
        const parentLink = titleLinks.find((l) => l.variant === "Primary");
        const columnLink = titleLinks.find((l) => l.variant === "Secondary");
        return {
          href: prismic.asLink(columnLink),
          label: columnLink?.text,
          target:
            columnLink?.link_type === "Web" ? columnLink.target : undefined,
          parentHref: prismic.asLink(parentLink),
          parentLabel: parentLink?.text,
          parentTarget:
            parentLink?.link_type === "Web" ? parentLink.target : undefined,
          links: links?.map((l) => ({
            href: prismic.asLink(l),
            label: l.text,
            target: l.link_type === "Web" ? l.target : undefined,
          })),
        };
      })
      // Drop empty columns (sublink rows with no title link and no links)
      // so an editor adding an unfilled "Item" doesn't render an empty dropdown.
      .filter((col) => col.label || col.parentLabel || col.links?.length),
  };
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <StyledHeader settings={settings} mainMenu={mainMenu} />
        {children}
        {settings.data.footer === "WithNewsletter" ? (
          <StyledFooterV2 settings={settings} menus={menus} />
        ) : (
          <StyledFooter settings={settings} menus={menus} />
        )}
      </body>
    </html>
  );
}
