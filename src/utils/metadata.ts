import { asText } from "@prismicio/client";
import getFullUrl from "@/utils/getFullUrl";
import type { Metadata } from "next";
import type { BlogDocument } from "../../prismicio-types";

export const createBlogMetadata = async (
  page: BlogDocument | null,
  params: { uid?: string } = {},
): Promise<Metadata> => {
  if (!page) return {};

  const title = asText(page.data.title) || undefined;
  const description = page.data.summary || undefined;
  const image = page.data.image?.url ?? undefined;
  const url = await getFullUrl(page.url);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: image ? [{ url: image }] : [],
    },
  };
};
