import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import { asText, asLink, isFilled } from "@prismicio/client";
import getFullUrl from "@/utils/getFullUrl";
import { createBlogMetadata } from "@/utils/metadata";
import type { BlogDocument } from "../../../../../prismicio-types";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const BlogLayout = dynamic(() => import("@/components/blog/layout-1"));
const BlogLayout2 = dynamic(() => import("@/components/blog/layout-2"));

export const revalidate = 25920000;
export const dynamicParams = false;

const client = createClient();
const settings = await client.getSingle("settings");

interface BlogPageProps {
  params: Promise<{ uid: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { uid } = await params;
  const page = await client.getByUID("blog", uid).catch(() => null);

  if (!page) notFound();

  const schema = await schemaTemplate(page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      {settings.data.blog === "WithSidebar" ? (
        <BlogLayout2 page={page} settings={settings} />
      ) : (
        <BlogLayout page={page} settings={settings} />
      )}
    </>
  );
}

export async function generateStaticParams() {
  const pages = await client.getAllByType("blog", { fetch: ["blog.title"] });

  return pages.map((page) => {
    return { uid: page.uid };
  });
}

export async function generateMetadata(
  props: BlogPageProps,
): Promise<Metadata> {
  const params = await props.params;

  const page = await client.getByUID("blog", params.uid).catch(() => null);

  return createBlogMetadata(page, params);
}

const schemaTemplate = async (page: BlogDocument) => {
  const publisher = page.data.publisher;
  const authorSchema =
    typeof publisher === "string"
      ? publisher
        ? { "@type": "Person", name: publisher }
        : null
      : isFilled.contentRelationship(publisher) &&
          publisher.data &&
          isFilled.richText(publisher.data.title)
        ? {
            "@type": "Person",
            name: asText(publisher.data.title),
            url: await getFullUrl(publisher.url),
            ...(isFilled.link(publisher.data.linkedin)
              ? { sameAs: asLink(publisher.data.linkedin) }
              : {}),
            ...(publisher.data.image?.url
              ? { image: publisher.data.image.url }
              : {}),
          }
        : null;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": await getFullUrl(page.url),
    },
    headline: asText(page.data.title) || "Untitled Blog Post",
    description: page.data.summary || "Blog post description",
    image: page.data.image?.url,
    ...(authorSchema ? { author: authorSchema } : {}),
    publisher: {
      "@type": "Organization",
      name: asText(settings?.data?.site_title),
      logo: {
        "@type": "ImageObject",
        url: settings.data.header_logo.url,
      },
    },
    datePublished: page.data?.publish_date
      ? new Date(page.data.publish_date).toISOString()
      : page.first_publication_date,
    dateModified: page.last_publication_date,
  };
};
