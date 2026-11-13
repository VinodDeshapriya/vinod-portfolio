import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { SliceZone } from "@prismicio/react";

export const revalidate = 25920000;
export const dynamicParams = false;

const client = createClient();
const settings = await client.getSingle("settings");

export default async function ServicePage({
  params,
}: PageProps<"/services/[uid]">) {
  const { uid } = await params;
  const page = await client.getByUID("service", uid).catch(() => null);

  if (!page) notFound();

  const schema = schemaTemplate();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{
          page,
          settings,
        }}
      />
    </>
  );
}

export async function generateStaticParams() {
  const pages = await client.getAllByType("service", {
    fetch: ["service.title"],
  });

  return pages.map((page) => {
    return { uid: page.uid };
  });
}

export async function generateMetadata(props: PageProps<"/services/[uid]">) {
  const params = await props.params;

  const page = await client.getByUID("service", params.uid).catch(() => null);

  return {};
}

// TODO: Update this
const schemaTemplate = () => {
  return {
    "@context": "https://schema.org",
  };
};
