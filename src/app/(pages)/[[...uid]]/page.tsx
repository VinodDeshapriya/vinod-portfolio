import { SliceZone } from "@prismicio/react";
import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import dynamicImport from "next/dynamic";
import type { Metadata } from "next";
import {
  createPageMetadata,
  generateCategoryPageSlugs,
  generateRepeatingPageSlugs,
  isHome,
  pageConfig,
} from "./pageUtils";

const Breadcrumbs = dynamicImport(() => import("@/components/ui/Breadcrumbs"));

export const revalidate = 25920000;
export const dynamicParams = false;

const client = createClient();
const settings = await client.getSingle("settings");

export async function generateStaticParams() {
  const pages = await client.getAllByType("page", {
    fetchLinks: ["page.uid", "page.parent_page"],
  });

  const repeatingPagesSlugList = await generateRepeatingPageSlugs(
    settings?.data?.repeatable_types,
  );

  const categoryPagesSlugList = await generateCategoryPageSlugs(
    settings?.data?.repeatable_types,
  );

  const allPages = pages.map(({ url }) => {
    return { uid: url?.split("/").filter(Boolean) };
  });

  const allSlugs = [
    ...allPages,
    ...repeatingPagesSlugList,
    ...categoryPagesSlugList,
  ];

  console.log(allSlugs);

  return allSlugs;
}

export async function generateMetadata({
  params,
}: PageProps<"/[[...uid]]">): Promise<Metadata> {
  const resolvedParams = await params;

  const { currentPageUid } = pageConfig(resolvedParams);

  const page = await client.getByUID("page", currentPageUid).catch(() => null);

  return createPageMetadata(page, settings, resolvedParams);
}

export default async function Page({ params }: PageProps<"/[[...uid]]">) {
  const resolvedParams = await params;

  const { currentPage, currentPageUid, categorySlug } =
    pageConfig(resolvedParams);

  const page = await client.getByUID("page", currentPageUid).catch(() => null);

  if (!page) notFound();

  return (
    <>
      {!isHome(currentPageUid) && <Breadcrumbs page={page} />}
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{
          page,
          settings,
          currentPage: currentPage,
          firstPage: page.url,
          category: categorySlug,
        }}
      />
    </>
  );
}
