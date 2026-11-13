import { createClient } from "@/prismicio";
import { asText, filter, GroupField, isFilled } from "@prismicio/client";
import getFullUrl from "@/utils/getFullUrl";
import type { Metadata } from "next";
import {
  AllDocumentTypes,
  PageDocument,
  SettingsDocument,
  SettingsDocumentDataRepeatableTypesItem,
  Simplify,
} from "../../../../prismicio-types";

const client = createClient();

interface Params {
  uid?: string[];
}

export const isHome = (uid: string): boolean => uid === "home";

export const pageConfig = (params: Params) => {
  const rawUid = params?.uid ?? [];

  const isPaginatedPage = rawUid.at(-2) === "page";
  const currentPage = isPaginatedPage ? Number(rawUid.at(-1)) || 1 : 1;
  const uidWithoutPage = isPaginatedPage ? rawUid.slice(0, -2) : rawUid;

  const isCategoryPage = uidWithoutPage.at(-2) === "category";
  const categorySlug = isCategoryPage ? (uidWithoutPage.at(-1) ?? null) : null;
  const uidWithoutCategory = isCategoryPage
    ? uidWithoutPage.slice(0, -2)
    : uidWithoutPage;

  const uid = uidWithoutCategory.length
    ? uidWithoutCategory[uidWithoutCategory.length - 1]
    : "home";

  const paginatedPageSlug = isPaginatedPage
    ? (uidWithoutCategory[0] ?? null)
    : null;
  const currentPageUid = paginatedPageSlug || uid;

  return {
    uid,
    isPaginatedPage,
    paginatedPageSlug,
    isCategoryPage,
    categorySlug,
    currentPage,
    currentPageUid,
  };
};

export const generateRepeatingPageSlugs = async (
  repeating: GroupField<Simplify<SettingsDocumentDataRepeatableTypesItem>>,
) => {
  const repeatingPages: { uid: string[] }[] = [];

  for (let i = 0; i < repeating?.length; i++) {
    const { items_per_page, type, parent_page } = repeating[i];

    if (!type) continue;
    if (!isFilled.contentRelationship(parent_page) || !parent_page.url) continue;

    const docType = type as AllDocumentTypes["type"];

    const res = await client.getByType(docType, {
      page: 1,
      pageSize: items_per_page ?? undefined,
      fetch: [`${docType}.title`],
    });

    const { total_pages } = res;
    const basePath = parent_page.url.split("/").filter(Boolean);

    repeatingPages.push(
      ...[...Array(total_pages - 1).keys()].map((i) => ({
        uid: [...basePath, "page", `${i + 2}`],
      })),
    );
  }

  return repeatingPages;
};

export const generateCategoryPageSlugs = async (
  repeating: GroupField<Simplify<SettingsDocumentDataRepeatableTypesItem>>,
) => {
  const blogRepeatable = repeating?.find((r) => r?.type === "blog");

  if (!blogRepeatable) return [];

  const { items_per_page, parent_page } = blogRepeatable;
  if (!isFilled.contentRelationship(parent_page) || !parent_page.url) return [];
  const basePath = parent_page.url.split("/").filter(Boolean);

  const categories = await client.getAllByType("blog_categories");
  const categoryPages: { uid: string[] }[] = [];

  if (categories.length === 0) return [];

  // Only pre-render category pages for categories that are actually
  // assigned to a blog post, and only when there's more than one — mirrors
  // the visibility rule for the category filter UI in ContentListing.
  try {
    const allBlogs = await client.getAllByType("blog", {
      fetch: ["blog.category"],
    });

    const usedCategoryIds = new Set(
      allBlogs
        .map((b) => b.data.category)
        .filter(isFilled.contentRelationship)
        .map((c) => c.id),
    );

    const usedCategories = categories.filter((c) => usedCategoryIds.has(c.id));

    if (usedCategories.length <= 1) return [];

    for (const category of usedCategories) {
      const { total_pages } = await client.getByType("blog", {
        page: 1,
        pageSize: items_per_page ?? undefined,
        filters: [filter.at("my.blog.category", category.id)],
      });

      categoryPages.push({ uid: [...basePath, "category", category.uid] });

      categoryPages.push(
        ...[...Array(Math.max(total_pages - 1, 0)).keys()].map((i) => ({
          uid: [...basePath, "category", category.uid, "page", `${i + 2}`],
        })),
      );
    }

    return categoryPages;
  } catch {
    // The `category` field may not be published to the Prismic repository
    // yet (custom type change pending a Slice Machine push).
    return [];
  }
};

export const createMetaTitle = (
  page: PageDocument | null,
  settings: SettingsDocument,
  params: Params = {},
): string => {
  const { isPaginatedPage, currentPage } = pageConfig(params);

  const mainTitle =
    page?.data?.meta_title ||
    settings?.data?.meta_title ||
    asText(page?.data.title) ||
    "";

  if (isPaginatedPage) {
    return mainTitle + ` | Page ${currentPage}`;
  }

  return mainTitle;
};

export const createMetaDescription = (
  page: PageDocument | null,
  settings: SettingsDocument,
): string | undefined => {
  return page?.data?.meta_description || settings?.data?.meta_description || "";
};

export const createPageMetadata = async (
  page: PageDocument | null,
  settings: SettingsDocument,
  params: Params = {},
): Promise<Metadata> => {
  const title = createMetaTitle(page, settings, params);
  const description = createMetaDescription(page, settings);

  const ogImageUrl =
    page?.data.meta_image?.url ?? settings?.data?.meta_image?.url ?? undefined;

  const url =
    page?.data.canonical_url ||
    (await getFullUrl(
      typeof params?.uid === "object" ? params?.uid?.join("/") : page?.url,
    ));

  return {
    title,
    description,
    openGraph: {
      title: page?.data.og_title || title,
      description: page?.data.og_description || description,
      url,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
  };
};
