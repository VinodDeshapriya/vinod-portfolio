import Link from "next/link";
import StyledContainer from "@/components/ui/StyledContainer";
import { asText, RichTextField } from "@prismicio/client";
import projectConfig from "../../../project.config";
import clsx from "clsx";
import Home from "atd-icons/dist/Home";
import ChevronForward from "atd-icons/dist/ChevronForward";

interface PageData {
  title: RichTextField;
}

interface Page {
  data: PageData;
  url?: string | null;
  type?: string;
}

interface BreadcrumbLink {
  label: string;
  link: string;
}

export default async function Breadcrumbs({ page }: { page: Page }) {
  const { links, schema } = await generateLinks(page);

  if (!links || !links.length) return null;
  return (
    <section style={{ backgroundColor: "#F9F9F9" }}>
      {schema}
      <StyledContainer>
        <ol className="flex items-center py-[14px]">
          {links?.map(({ link, label }, idx) => {
            const isLast = idx === links.length - 1;
            return (
              <li
                key={idx}
                className={clsx("flex items-center", {
                  "min-w-0 flex-1": isLast,
                })}
              >
                {!!idx && (
                  <ChevronForward
                    size={16}
                    className="text-text-inactive mx-2 shrink-0"
                  />
                )}
                <Link
                  href={link}
                  className={clsx("text-body-base md:text-body-medium", {
                    "flex items-center gap-1": idx === 0,
                    "text-nowrap": !isLast,
                    "line-clamp-1 min-w-0": isLast,
                    "text-primary-light": isLast,
                    "text-text-inactive": !isLast,
                  })}
                >
                  {idx === 0 ? (
                    <>
                      <Home size={16} className="md:hidden" />
                      <span className="hidden md:inline">Home</span>
                    </>
                  ) : (
                    label
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </StyledContainer>
    </section>
  );
}

const generateLinks = async (
  page: Page,
): Promise<{ links: BreadcrumbLink[]; schema: React.JSX.Element }> => {
  const links: BreadcrumbLink[] = [{ label: "Home", link: "/" }];
  links.push(...generateMiddleLinks(page));
  links.push({ label: asText(page.data.title), link: page?.url ?? "/" });

  const s = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: links.map((item, index) => {
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: `${projectConfig.baseUrl}${item.link}`,
      };
    }),
  };

  const schema = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(s),
      }}
    />
  );

  return { links, schema };
};

const generateMiddleLinks = (page: Page): BreadcrumbLink[] => {
  switch (page?.type) {
    case "blog":
      return [{ label: "Blogs", link: "/blogs" }];
    case "author":
      return [{ label: "Authors", link: "/authors" }];
    default:
      return [];
  }
};
