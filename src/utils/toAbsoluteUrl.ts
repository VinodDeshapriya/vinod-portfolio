import type { LinkField } from "@prismicio/client";

// Skip anything the browser already resolves on its own:
//   scheme  https:// mailto: tel:   -> [a-z][a-z0-9+.-]*:
//   protocol-relative //cdn...      -> //
//   root-relative /about            -> /
//   fragment / query  #x  ?x        -> [#?]
const RESOLVABLE = /^(?:[a-z][a-z0-9+.-]*:|\/\/|\/|[#?])/i;

/**
 * Prefix a schemeless web URL with `https://` so it resolves as an external
 * link instead of a route-relative path. Already-resolvable values pass through.
 *
 * Prismic "Link to Web" fields store exactly what an editor types, so a value
 * like `linkedin.com/in/jane` reaches `next/link` as-is and the browser resolves
 * it against the current route (e.g. `/authors/linkedin.com`).
 */
const toAbsoluteUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed || RESOLVABLE.test(trimmed)) return url;
  return `https://${trimmed}`;
};

/**
 * Return a copy of a "Link to Web" field with its URL made absolute.
 * Non-Web link types (document, media, empty) pass through untouched.
 * Pure/immutable — Prismic field objects are cached and shared across renders.
 */
export const withAbsoluteUrl = (field: LinkField): LinkField => {
  if (field.link_type === "Web" && field.url) {
    return { ...field, url: toAbsoluteUrl(field.url) };
  }
  return field;
};

export default toAbsoluteUrl;
