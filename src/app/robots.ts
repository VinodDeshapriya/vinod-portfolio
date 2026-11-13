import getFullUrl from "@/utils/getFullUrl";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: getFullUrl("/sitemap.xml"),
  };
}
