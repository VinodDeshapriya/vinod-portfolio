import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import { asText, isFilled } from "@prismicio/client";
import { components } from "@/slices";
import { SliceZone } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { Linkedin, Image as ImageIcon } from "atd-icons";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicRichText from "@/components/ui/PrismicRichText";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { withAbsoluteUrl } from "@/utils/toAbsoluteUrl";
import type { AuthorDocument } from "../../../../../prismicio-types";

export const revalidate = 25920000;
export const dynamicParams = false;

const client = createClient();
const settings = await client.getSingle("settings");

export default async function AuthorPage({
  params,
}: PageProps<"/authors/[uid]">) {
  const { uid } = await params;
  const page = await client.getByUID("author", uid).catch(() => null);

  if (!page) notFound();

  const schema = schemaTemplate(page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <Breadcrumbs page={page} />

      <StyledContainer
        slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      >
        <div className="flex flex-col xl:flex-row items-center xl:items-start text-center xl:text-left justify-center w-full gap-8 xl:gap-10">
          <div className="flex-shrink-0">
            {isFilled.image(page.data.image) ? (
              <PrismicNextImage
                field={page.data.image}
                fallbackAlt=""
                className="max-w-[250px] w-full rounded-full aspect-square object-cover"
              />
            ) : (
              <div className="max-w-[250px] w-full aspect-square rounded-full flex items-center justify-center bg-offwhite">
                <ImageIcon size={32} className="text-text-inactive" />
              </div>
            )}
          </div>

          <div className="flex-grow">
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-center xl:justify-start gap-3 ">
                <h1 className="text-title-x-large text-text-heading">
                  {asText(page.data.title)}
                </h1>
                {isFilled.link(page.data.linkedin) && (
                  <PrismicNextLink
                    field={withAbsoluteUrl(page.data.linkedin)}
                    aria-label="LinkedIn"
                    className="text-primary-light hover:text-primary-dark transition-colors"
                  >
                    <Linkedin size={32} className="md:mt-[4px] md:size-10" />
                  </PrismicNextLink>
                )}
              </div>

              {page.data.role && (
                <p className="text-body-medium text-text-description">
                  {page.data.role}
                </p>
              )}
            </div>

            <PrismicRichText
              field={page.data.summary}
              parentClassName="mt-6 text-text-description"
            />
          </div>
        </div>

        <SliceZone
          slices={page.data.slices}
          components={components}
          context={{
            page,
            settings,
          }}
        />
      </StyledContainer>
    </>
  );
}

export async function generateStaticParams() {
  const pages = await client.getAllByType("author", {
    fetch: ["author.title"],
  });

  return pages.map((page) => {
    return { uid: page.uid };
  });
}

export async function generateMetadata(props: PageProps<"/authors/[uid]">) {
  const params = await props.params;

  const page = await client.getByUID("author", params.uid).catch(() => null);

  return {};
}

const schemaTemplate = (page: AuthorDocument) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: asText(page?.data?.title),
    jobTitle: page?.data?.role,
    description: asText(page?.data?.summary),
    image: page?.data?.image?.url,
  };
};
