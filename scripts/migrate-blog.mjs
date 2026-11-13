#!/usr/bin/env node
/**
 * Scrapes the 71 blog posts at brightchoiceelectrical.com.au (WordPress + Elementor)
 * from their sitemap and migrates them into Prismic's `blog` custom type using the
 * Content Migration API.
 *
 * Run:
 *   DRY_RUN=1 node scripts/migrate-blog.mjs   # scrape only, no Prismic writes
 *   node scripts/migrate-blog.mjs             # scrape + migrate
 *
 * Env vars (see README section printed by --help-ish comment below):
 *   PRISMIC_MIGRATION_TOKEN  (required unless DRY_RUN=1) write token from
 *                            Repository Settings > API & Security > Migration API
 *   PRISMIC_REPOSITORY       defaults to slicemachine.config.json's repositoryName
 *   PRISMIC_LOCALE           defaults to "en-us"
 *   BLOG_SITEMAP_URL         defaults to the brightchoiceelectrical post sitemap
 *   LIMIT                    only scrape/migrate the first N urls (testing)
 *   DRY_RUN=1                scrape + write migration-output/scraped.json, skip Prismic
 *   SCRAPE_DELAY_MS          delay between source-site requests (default 700)
 *   BATCH_SIZE               documents per migrate() call (default 8)
 *   BATCH_DELAY_MS           delay between migrate() batches (default 5000)
 *   MAX_RETRIES              retry attempts for network/429/5xx errors (default 4)
 *
 * Re-running: migration-output/report.json records which UIDs already succeeded, so
 * a re-run skips them instead of creating duplicate documents. Delete that file (or the
 * whole migration-output/ folder) to start over from scratch.
 */

import "dotenv/config";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";
import * as cheerio from "cheerio";
import * as prismic from "@prismicio/client";
import { htmlAsRichText } from "@prismicio/migrate";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Config ──────────────────────────────────────────────────────────────────

const readSlicemachineConfig = () =>
  JSON.parse(readFileSync(join(ROOT, "slicemachine.config.json"), "utf8"));

const SITEMAP_URL =
  process.env.BLOG_SITEMAP_URL ||
  "https://brightchoiceelectrical.com.au/post-sitemap.xml";
const REPOSITORY_NAME =
  process.env.PRISMIC_REPOSITORY || readSlicemachineConfig().repositoryName;
const WRITE_TOKEN = process.env.PRISMIC_MIGRATION_TOKEN;
const LANG = process.env.PRISMIC_LOCALE || "en-us";
const SCRAPE_DELAY_MS = Number(process.env.SCRAPE_DELAY_MS || 700);
const BATCH_SIZE = Number(process.env.BATCH_SIZE || 8);
const BATCH_DELAY_MS = Number(process.env.BATCH_DELAY_MS || 5000);
const MAX_RETRIES = Number(process.env.MAX_RETRIES || 4);
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : null;
const DRY_RUN = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const OUTPUT_DIR = join(ROOT, "migration-output");

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; BrightChoicePrismicMigration/1.0)",
  "Accept-Language": "en-AU,en;q=0.9",
};

const info = (msg) => console.log(`[migrate-blog] ${msg}`);
const warn = (msg) => console.warn(`[migrate-blog] WARN: ${msg}`);
const logError = (msg) => console.error(`[migrate-blog] ERROR: ${msg}`);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const REPORT_WARNINGS = [];

// ── Field models (read live from the repo so this stays in sync with Slice Machine) ──

const TEXT_BLOCK_MODEL = JSON.parse(
  readFileSync(join(ROOT, "src/slices-blogs/TextBlock/model.json"), "utf8"),
);
const FAQS_MODEL = JSON.parse(
  readFileSync(join(ROOT, "src/slices/FAQs/model.json"), "utf8"),
);

const KNOWN_BLOCK_TYPES = new Set([
  "paragraph",
  "preformatted",
  "heading1",
  "heading2",
  "heading3",
  "heading4",
  "heading5",
  "heading6",
  "list-item",
  "o-list-item",
  "image",
  "embed",
]);

function allowedBlocksFromConfig(multiString) {
  const tokens = (multiString || "").split(",").map((t) => t.trim());
  const allowed = new Set(tokens.filter((t) => KNOWN_BLOCK_TYPES.has(t)));
  allowed.add("paragraph");
  return allowed;
}

const TEXT_BLOCK_CONTENT_ALLOWED = allowedBlocksFromConfig(
  TEXT_BLOCK_MODEL.variations[0].primary.content.config.multi,
);
const FAQ_ANSWER_ALLOWED = allowedBlocksFromConfig(
  FAQS_MODEL.variations[0].primary.faqs.config.fields.answer.config.multi,
);

// Drops/downgrades any rich text node whose type isn't allowed by the target
// field's model, so we never hand Prismic a document it will reject.
function restrictRichText(nodes, allowed) {
  return (nodes || [])
    .map((node) => {
      if (!node) return null;
      if (allowed.has(node.type)) return node;
      if (node.type === "image") return null;
      return { ...node, type: "paragraph" };
    })
    .filter(Boolean);
}

const toRichText = (type, text) => (text ? [{ type, text, spans: [] }] : []);

// True if the rich text array has any non-blank text or an image — used to
// drop degenerate sections, e.g. a lead-in heading like "<h2>FAQs</h2>" that
// sits right before an accordion widget living outside the scraped content
// flow, leaving nothing behind it.
function hasMeaningfulContent(nodes) {
  return (nodes || []).some((n) => n?.type === "image" || (n?.text || "").trim());
}

// ── HTTP helpers ────────────────────────────────────────────────────────────

// Errors the Prismic Migration SDK throws as plain Error objects (no HTTP
// status attached), for conditions that will never succeed on retry.
const NON_RETRIABLE_MESSAGE = /already exists|invalid|not found|forbidden|unauthorized/i;

async function withRetry(fn, { retries = MAX_RETRIES, baseDelay = 1000, label = "" } = {}) {
  let attempt = 0;
  for (;;) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;
      const status = err?.response?.status;
      const deterministic = NON_RETRIABLE_MESSAGE.test(err?.message || "");
      const retriable = !deterministic && (!status || status === 429 || status >= 500);
      if (!retriable || attempt > retries) throw err;
      const wait = Math.round(baseDelay * 2 ** (attempt - 1) + Math.random() * 400);
      warn(`retry ${attempt}/${retries} for ${label}: ${err.message} (waiting ${wait}ms)`);
      await sleep(wait);
    }
  }
}

async function fetchHtml(url) {
  const { data } = await withRetry(
    () => axios.get(url, { headers: HEADERS, timeout: 20000 }),
    { label: `GET ${url}` },
  );
  return data;
}

async function getPostUrls() {
  const xml = await withRetry(
    async () => (await axios.get(SITEMAP_URL, { headers: HEADERS, timeout: 20000 })).data,
    { label: "GET sitemap" },
  );
  const $ = cheerio.load(xml, { xmlMode: true });
  const urls = $("url > loc")
    .toArray()
    .map((el) => $(el).text().trim())
    .filter(Boolean);
  return [...new Set(urls)];
}

// ── Small utils ─────────────────────────────────────────────────────────────

function slugFromUrl(url) {
  const { pathname } = new URL(url);
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] || "post";
  return last
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

function filenameFromUrl(url) {
  try {
    const { pathname } = new URL(url);
    const base = pathname.split("/").pop() || "image";
    return decodeURIComponent(base).slice(0, 120);
  } catch {
    return "image";
  }
}

function resolveMaybe(href, base) {
  if (!href || href.startsWith("#")) return "";
  if (/^(tel:|mailto:)/i.test(href)) return href;
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

// ── Image normalization (lazyload data-src/srcset -> absolute src) ─────────

function pickBestFromSrcset(srcset) {
  if (!srcset) return null;
  const candidates = srcset
    .split(",")
    .map((s) => s.trim())
    .map((s) => {
      const [url, w] = s.split(/\s+/);
      return { url, width: w ? parseInt(w, 10) : 0 };
    })
    .filter((c) => c.url);
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.width - a.width);
  return candidates[0].url;
}

function resolveImageUrl($img, baseUrl) {
  let src = $img.attr("src");
  if (!src || src.startsWith("data:")) src = $img.attr("data-src") || src;
  const best = pickBestFromSrcset($img.attr("data-srcset") || $img.attr("srcset"));
  if (best) src = best;
  if (!src || src.startsWith("data:")) return null;
  try {
    return new URL(src, baseUrl).toString();
  } catch {
    return null;
  }
}

// Tags two visually-adjacent <img> elements (only whitespace between their
// block wrappers) with data-grid="2col" so the rich text serializer can carry
// that through as a `label` on the resulting image nodes.
function tagAdjacentImagePairs($, $root) {
  const imgs = $root.find("img").toArray();
  for (let i = 0; i < imgs.length - 1; i += 1) {
    const a = imgs[i];
    const b = imgs[i + 1];
    const wrapA = $(a).closest("figure, p")[0] || a;
    const wrapB = $(b).closest("figure, p")[0] || b;
    if (wrapA.parent !== wrapB.parent) continue;
    let node = wrapA.next;
    let onlyWhitespaceBetween = true;
    while (node && node !== wrapB) {
      if (node.type === "text" && node.data && node.data.trim() !== "") {
        onlyWhitespaceBetween = false;
        break;
      }
      if (node.type === "tag") {
        onlyWhitespaceBetween = false;
        break;
      }
      node = node.next;
    }
    if (onlyWhitespaceBetween && node === wrapB) {
      $(a).attr("data-grid", "2col");
      $(b).attr("data-grid", "2col");
      i += 1; // don't chain a third image into the same pair
    }
  }
}

function normalizeImages($, $root, baseUrl) {
  $root.find("img").each((_, el) => {
    const $img = $(el);
    const resolved = resolveImageUrl($img, baseUrl);
    if (resolved) $img.attr("src", resolved);
    ["data-src", "data-srcset", "srcset", "sizes", "data-sizes", "loading", "fetchpriority", "decoding", "style"].forEach(
      (attr) => $img.removeAttr(attr),
    );
  });
  tagAdjacentImagePairs($, $root);
}

// ── DOM cleanup / section detection (selectors verified against live markup) ─

function findElementorContainer($el) {
  let node = $el[0];
  let depth = 0;
  while (node && node.parent && depth < 8) {
    const cls = node.parent.attribs?.class || "";
    if (/\be-parent\b/.test(cls)) return node.parent;
    node = node.parent;
    depth += 1;
  }
  return null;
}

function removeSectionByHeadingText($, $scope, regex) {
  $scope.find("h1,h2,h3,h4").each((_, el) => {
    const $el = $(el);
    if (!regex.test($el.text().replace(/\s+/g, " ").trim())) return;
    const $anchor = $el.closest(".elementor-widget-heading").length
      ? $el.closest(".elementor-widget-heading")
      : $el;
    const container = findElementorContainer($anchor);
    (container ? $(container) : $anchor).remove();
  });
}

// The site mixes two authoring patterns across its 71 posts: plain WordPress
// block content (h2/p/figure as flat siblings) and fully Elementor-built
// posts where every paragraph/heading is its own widget buried several
// container divs deep. Children-only traversal misses the second pattern
// entirely, so instead we flatten to the content elements anywhere under
// $contentRoot, keeping only the outermost match of each (so a <p> inside a
// <ul><li> isn't also pulled out as a second, duplicate paragraph).
function collectContentFlow($, $contentRoot) {
  const selector = "h2, h3, p, ul, ol, img";
  const all = $contentRoot.find(selector).toArray();
  const allSet = new Set(all);
  return all.filter((el) => {
    let parent = el.parent;
    while (parent && parent !== $contentRoot[0]) {
      if (allSet.has(parent)) return false;
      parent = parent.parent;
    }
    return true;
  });
}

function extractSummary($, flow) {
  const paras = [];
  for (const el of flow) {
    const $el = $(el);
    if ($el.is("h2")) break;
    if ($el.is("p")) {
      const t = $el.text().trim();
      if (t) paras.push(t);
    }
  }
  if (paras.length) return paras.join("\n\n");

  // Some posts open straight into an <h2> with nothing before it (occasionally
  // a duplicate of the page's own H1). Fall back to the first paragraph found
  // anywhere in the body rather than leaving Summary blank.
  for (const el of flow) {
    if ($(el).is("p")) {
      const t = $(el).text().trim();
      if (t) return t;
    }
  }
  return "";
}

function extractFeaturedImage($, flow) {
  const imgEl = flow.find((el) => $(el).is("img"));
  if (!imgEl) return null;
  const $img = $(imgEl);
  const src = $img.attr("src");
  if (!src || src.startsWith("data:")) return null;
  return { url: src, alt: $img.attr("alt") || "" };
}

// Splits the article body into one section per <h2>. Content before the
// first <h2> is the Summary zone and is not included in any section.
function splitSections($, flow) {
  const sections = [];
  let current = null;
  for (const el of flow) {
    const $el = $(el);
    if ($el.is("h2")) {
      if (current) sections.push(current);
      current = { title: $el.text().trim(), html: "" };
      continue;
    }
    if (!current) continue;
    current.html += $.html(el);
  }
  if (current) sections.push(current);
  return sections;
}

// A heading + description + one-or-more buttons living in their own Elementor
// container after the article body (e.g. "Ready to Upgrade Your
// Switchboard?" / "Get a Fast Quote" + "Call Now") -> CallToAction slice.
function detectCallToActionBanner($, $scope) {
  const headingWidgets = $scope.find(".elementor-widget-heading").toArray();
  for (const hw of headingWidgets) {
    const $hw = $(hw);
    if ($hw.closest(".elementor-widget-theme-post-content").length) continue;
    if ($hw.closest(".elementor-widget-toggle").length) continue;
    const container = findElementorContainer($hw) || $hw.parent()[0];
    if (!container) continue;
    const $container = $(container);
    const $buttons = $container.find(".elementor-widget-button a, a.elementor-button");
    if (!$buttons.length) continue;
    const title = $hw.find("h1,h2,h3,h4,h5,h6").first().text().trim() || $hw.text().trim();
    const description = $container.find(".elementor-widget-text-editor").first().text().trim();
    const buttons = $buttons
      .toArray()
      .map((a) => ({
        text: $(a).find(".elementor-button-text").text().trim() || $(a).text().trim(),
        href: $(a).attr("href") || "",
      }))
      .filter((b) => b.text);
    if (title && buttons.length) return { title, description, buttons };
  }
  return null;
}

function detectFaqs($, $scope, baseUrl) {
  const faqs = [];
  $scope
    .find(".elementor-widget-toggle .elementor-toggle-item, .elementor-accordion .elementor-accordion-item")
    .each((_, item) => {
      const $item = $(item);
      const question = $item
        .find(".elementor-toggle-title, .elementor-tab-title, .elementor-accordion-title")
        .first()
        .text()
        .trim();
      const $answer = $item.find(".elementor-tab-content, .elementor-accordion-content").first();
      if (!question || !$answer.length) return;
      normalizeImages($, $answer, baseUrl);
      const html = ($answer.html() || "").trim();
      if (html) faqs.push({ question, html });
    });
  return faqs;
}

// Author byline + publish date, e.g.:
//   <meta property="article:published_time" content="2026-02-16T01:09:34+00:00" />
//   <span class="elementor-post-info__item--type-author">Written by X</span>
function extractPublishInfo($) {
  const publishedMeta = $('meta[property="article:published_time"]').attr("content");
  const publishDate = publishedMeta ? publishedMeta.slice(0, 10) : null; // -> "YYYY-MM-DD"

  const $authorItem = $(".elementor-post-info__item--type-author").first();
  let publisher = $authorItem.text().trim();
  const prefix = $authorItem.find(".elementor-post-info__item-prefix").text().trim();
  if (prefix && publisher.startsWith(prefix)) {
    publisher = publisher.slice(prefix.length).trim();
  }

  return { publisher: publisher || null, publishDate };
}

// ── Scrape a single post ─────────────────────────────────────────────────────

async function scrapePost(url) {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const $article = $('article[data-elementor-type="single-post"]').first();
  const $scope = $article.length ? $article : $("body");

  $scope.find("form, script, style, noscript").remove();
  removeSectionByHeadingText($, $scope, /more related articles|^related articles$/i);
  removeSectionByHeadingText($, $scope, /need expert electrical services/i);
  // Safety net: strip any leftover related-post grids even if the heading text differs.
  $scope.find(".elementor-widget-posts, .elementor-widget-loop-grid").each((_, el) => {
    const container = findElementorContainer($(el));
    (container ? $(container) : $(el)).remove();
  });

  const title = $scope.find("h1").first().text().trim() || $("h1").first().text().trim();
  const { publisher, publishDate } = extractPublishInfo($);

  const $contentWidget = $scope.find(".elementor-widget-theme-post-content .elementor-widget-container").first();
  const $contentRoot = $contentWidget.length ? $contentWidget : $scope;

  normalizeImages($, $contentRoot, url);

  const flow = collectContentFlow($, $contentRoot);
  const summary = extractSummary($, flow);
  const featuredImage = extractFeaturedImage($, flow);
  const sections = splitSections($, flow);

  if (title.length > 140) {
    REPORT_WARNINGS.push({
      url,
      ctx: "title",
      warning: `H1 is unusually long (${title.length} chars) — check the source page for concatenated/duplicated text: "${title}"`,
    });
  }

  // "Contact us" button detection (rule 3, CtaBlock)
  let ctaBlock = null;
  $contentRoot.find("a, button").each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim().replace(/\s+/g, " ");
    if (/^contact us$/i.test(text)) {
      ctaBlock = { text: "Contact us", href: $el.attr("href") || "" };
      return false;
    }
  });

  const callToAction = detectCallToActionBanner($, $scope);
  const faqs = detectFaqs($, $scope, url);

  return {
    url,
    uid: slugFromUrl(url),
    title,
    summary,
    featuredImage,
    sections,
    ctaBlock,
    callToAction,
    faqs,
    publisher,
    publishDate,
  };
}

// ── Build the Prismic Migration document from scraped data ─────────────────

function makeImageSerializer(migration) {
  return {
    img: ({ node }) => {
      const src = node.properties?.src ?? node.attribs?.src;
      if (!src) return undefined;
      const alt = node.properties?.alt ?? node.attribs?.alt ?? "";
      const grid =
        node.properties?.dataGrid ?? node.properties?.["data-grid"] ?? node.attribs?.["data-grid"];
      const imageNode = {
        type: "image",
        id: migration.createAsset(src, filenameFromUrl(src), alt ? { alt } : undefined),
      };
      if (grid) imageNode.label = "grid-2col";
      return imageNode;
    },
  };
}

function logWarnings(url, ctx, warnings) {
  if (!warnings?.length) return;
  for (const w of warnings) {
    REPORT_WARNINGS.push({ url, ctx, warning: typeof w === "string" ? w : JSON.stringify(w) });
  }
}

function buildPrismicDocument(migration, post) {
  const imgSerializer = makeImageSerializer(migration);
  const slices = [];

  for (const section of post.sections) {
    const { result, warnings } = htmlAsRichText(section.html, { serializer: imgSerializer });
    logWarnings(post.url, `section "${section.title}"`, warnings);
    const content = restrictRichText(result, TEXT_BLOCK_CONTENT_ALLOWED);
    if (!hasMeaningfulContent(content)) continue; // e.g. a lead-in "FAQs" heading with nothing after it
    slices.push({
      slice_type: "text_block",
      variation: "default",
      primary: {
        title: toRichText("heading2", section.title),
        content,
      },
      items: [],
    });
  }

  if (post.ctaBlock) {
    slices.push({
      slice_type: "cta_block",
      variation: "default",
      primary: {
        buttons: [
          {
            link_type: "Web",
            url: resolveMaybe(post.ctaBlock.href, post.url),
            text: post.ctaBlock.text,
            variant: "Primary",
          },
        ],
      },
      items: [],
    });
  }

  if (post.callToAction) {
    slices.push({
      slice_type: "c_t_a",
      variation: "default",
      primary: {
        title: toRichText("heading2", post.callToAction.title),
        description: toRichText("paragraph", post.callToAction.description),
        buttons: post.callToAction.buttons.map((b, i) => ({
          link_type: "Web",
          url: resolveMaybe(b.href, post.url),
          text: b.text,
          variant: i === 0 ? "Primary" : "Secondary",
        })),
      },
      items: [],
    });
  }

  if (post.faqs.length) {
    slices.push({
      slice_type: "f_a_qs",
      variation: "default",
      primary: {
        title: toRichText("heading2", "FAQs"),
        faqs: post.faqs.map((f) => {
          const wrapped = /^\s*<(p|ul|ol|h[1-6])/i.test(f.html) ? f.html : `<p>${f.html}</p>`;
          const { result, warnings } = htmlAsRichText(wrapped, { serializer: imgSerializer });
          logWarnings(post.url, `FAQ "${f.question}"`, warnings);
          return {
            question: toRichText("heading4", f.question),
            answer: restrictRichText(result, FAQ_ANSWER_ALLOWED),
          };
        }),
      },
      items: [],
    });
  }

  const data = {
    title: toRichText("heading1", post.title),
    summary: post.summary,
    slices,
  };

  if (post.publisher) data.publisher = post.publisher;
  if (post.publishDate) data.publish_date = post.publishDate;

  if (post.featuredImage) {
    data.image = migration.createAsset(
      post.featuredImage.url,
      filenameFromUrl(post.featuredImage.url),
      post.featuredImage.alt ? { alt: post.featuredImage.alt } : undefined,
    );
  }

  return { type: "blog", uid: post.uid, lang: LANG, data };
}

// ── Report helpers (resumable runs) ─────────────────────────────────────────

function loadPreviousReport() {
  const p = join(OUTPUT_DIR, "report.json");
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function writeReport(data) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(join(OUTPUT_DIR, "report.json"), JSON.stringify(data, null, 2));
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  info(`Fetching sitemap: ${SITEMAP_URL}`);
  let urls = await getPostUrls();
  info(`Found ${urls.length} URLs in sitemap`);
  if (LIMIT) urls = urls.slice(0, LIMIT);

  const previousReport = loadPreviousReport();
  const alreadyDone = new Set((previousReport?.succeeded || []).map((d) => d.uid));
  if (alreadyDone.size) info(`Skipping ${alreadyDone.size} posts already migrated in a previous run`);

  const scraped = [];
  const scrapeErrors = [];

  for (const [i, url] of urls.entries()) {
    const uid = slugFromUrl(url);
    if (alreadyDone.has(uid)) continue;
    info(`[${i + 1}/${urls.length}] Scraping ${url}`);
    try {
      scraped.push(await scrapePost(url));
    } catch (err) {
      logError(`Failed to scrape ${url}: ${err.message}`);
      scrapeErrors.push({ url, error: err.message });
    }
    await sleep(SCRAPE_DELAY_MS);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(join(OUTPUT_DIR, "scraped.json"), JSON.stringify(scraped, null, 2));
  info(`Scraped ${scraped.length} posts (${scrapeErrors.length} failed). Saved to migration-output/scraped.json`);

  if (DRY_RUN) {
    info("DRY_RUN set — skipping Prismic migration.");
    writeReport({ succeeded: previousReport?.succeeded || [], failed: scrapeErrors, warnings: REPORT_WARNINGS });
    return;
  }

  if (!WRITE_TOKEN) {
    throw new Error("PRISMIC_MIGRATION_TOKEN is not set. Add it to your .env file or environment.");
  }

  const writeClient = prismic.createWriteClient(REPOSITORY_NAME, { writeToken: WRITE_TOKEN });

  const succeeded = [...(previousReport?.succeeded || [])];
  const failed = [...scrapeErrors];

  const batches = chunk(scraped, BATCH_SIZE);
  for (const [batchIndex, batch] of batches.entries()) {
    info(`Migrating batch ${batchIndex + 1}/${batches.length} (${batch.length} posts)`);
    const migration = prismic.createMigration();
    const batchPosts = [];

    for (const post of batch) {
      try {
        const doc = buildPrismicDocument(migration, post);
        migration.createDocument(doc, post.title);
        batchPosts.push(post);
      } catch (err) {
        logError(`Failed to build document for ${post.url}: ${err.message}`);
        failed.push({ url: post.url, error: err.message });
      }
    }

    if (!batchPosts.length) continue;

    try {
      await withRetry(
        () =>
          writeClient.migrate(migration, {
            reporter: (event) => info(`  [migrate] ${JSON.stringify(event)}`),
          }),
        { label: `migrate batch ${batchIndex + 1}`, retries: 3, baseDelay: 4000 },
      );
      for (const post of batchPosts) succeeded.push({ uid: post.uid, url: post.url });
      info(`Batch ${batchIndex + 1} migrated (${batchPosts.length} documents)`);
    } catch (err) {
      logError(`Batch ${batchIndex + 1} failed: ${err.message}`);
      for (const post of batchPosts) failed.push({ url: post.url, error: err.message });
    }

    writeReport({ succeeded, failed, warnings: REPORT_WARNINGS });

    if (batchIndex < batches.length - 1) {
      info(`Waiting ${BATCH_DELAY_MS}ms before next batch...`);
      await sleep(BATCH_DELAY_MS);
    }
  }

  writeReport({ succeeded, failed, warnings: REPORT_WARNINGS });
  info(`Done. ${succeeded.length} succeeded, ${failed.length} failed. See migration-output/report.json`);
}

main().catch((err) => {
  logError(err.stack || err.message);
  process.exitCode = 1;
});
