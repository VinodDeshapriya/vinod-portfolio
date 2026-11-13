"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Content, filter } from "@prismicio/client";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { Close } from "atd-icons";
import StyledInput from "@/components/ui/StyledInput";
import CheckboxDropdown from "@/components/ui/CheckboxDropdown";
import { createBrowserClient } from "@/prismicio";
import ClientPagination from "./ClientPagination";
import StyledPagination from "./StyledPagination";
import EmptyState from "./EmptyState";

const BlogTemplate = dynamic(() => import("./templates/BlogTemplate"));

type BlogFilterBarProps = {
  categories: Content.BlogCategoriesDocument[];
  tags: Content.BlogTagDocument[];
  initialItems: Content.BlogDocument[];
  initialTotalPages: number;
  initialPage: number;
  initialCategoryUid: string | null;
  basePath: string;
  initialFirstPage: string;
  pageSize: number;
  backgroundColor?: boolean;
};

const parseIds = (value: string | null) =>
  value ? value.split(",").filter(Boolean) : [];

const BlogFilterBar = ({
  categories,
  tags,
  initialItems,
  initialTotalPages,
  initialPage,
  initialCategoryUid,
  basePath,
  initialFirstPage,
  pageSize,
  backgroundColor,
}: BlogFilterBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasExplicitCategoryParam = searchParams.has("category");
  const categoryParam = parseIds(searchParams.get("category"));
  const tagParam = parseIds(searchParams.get("tags"));
  const qParam = searchParams.get("q") ?? "";
  const pageParam = Number(searchParams.get("page")) || 1;

  const selectedCategoryUids = hasExplicitCategoryParam
    ? categoryParam
    : initialCategoryUid
      ? [initialCategoryUid]
      : [];
  const selectedTagUids = tagParam;

  const isInitialState =
    !hasExplicitCategoryParam &&
    !searchParams.has("tags") &&
    !searchParams.has("q") &&
    !searchParams.has("page");

  const [searchInput, setSearchInput] = useState(qParam);
  const [prevQParam, setPrevQParam] = useState(qParam);
  const [fetchedItems, setFetchedItems] = useState<
    Content.BlogDocument[] | null
  >(null);
  const [fetchedTotalPages, setFetchedTotalPages] = useState<number | null>(
    null,
  );
  const [completedRequestKey, setCompletedRequestKey] = useState<string | null>(
    null,
  );

  const browserClient = useMemo(() => createBrowserClient(), []);

  // Keep the search input in sync when `q` changes externally (Reset,
  // browser back/forward) — adjusted during render per React's guidance,
  // rather than in an effect, to avoid an extra render pass.
  if (qParam !== prevQParam) {
    setPrevQParam(qParam);
    setSearchInput(qParam);
  }

  const buildUrl = (
    overrides: Partial<{
      category: string[];
      tags: string[];
      q: string;
      page: number;
    }>,
  ) => {
    const nextCategory = overrides.category ?? selectedCategoryUids;
    const nextTags = overrides.tags ?? selectedTagUids;
    const nextQ = overrides.q ?? qParam;
    const nextPage =
      overrides.page ??
      (overrides.category || overrides.tags || overrides.q !== undefined
        ? 1
        : pageParam);

    const params = new URLSearchParams();
    params.set("category", nextCategory.join(","));
    params.set("tags", nextTags.join(","));
    params.set("q", nextQ);
    params.set("page", String(nextPage));
    return `${basePath}?${params.toString()}`;
  };

  useEffect(() => {
    if (searchInput === qParam) return;
    const timeout = setTimeout(() => {
      router.push(buildUrl({ q: searchInput }));
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const requestKey = `${selectedCategoryUids.join(",")}|${selectedTagUids.join(",")}|${qParam}|${pageParam}`;
  const isLoading = !isInitialState && completedRequestKey !== requestKey;

  useEffect(() => {
    if (isInitialState) return;

    let cancelled = false;

    const categoryIds = selectedCategoryUids
      .map((uid) => categories.find((c) => c.uid === uid)?.id)
      .filter((id): id is string => Boolean(id));
    const tagIds = selectedTagUids
      .map((uid) => tags.find((t) => t.uid === uid)?.id)
      .filter((id): id is string => Boolean(id));

    const filters = [
      ...(categoryIds.length
        ? [filter.any("my.blog.category", categoryIds)]
        : []),
      ...(tagIds.length ? [filter.any("my.blog.tags.tag", tagIds)] : []),
      ...(qParam.trim()
        ? [filter.fulltext("my.blog.title", qParam.trim())]
        : []),
    ];

    browserClient
      .getByType("blog", {
        page: pageParam,
        pageSize,
        fetch: [
          "blog.title",
          "blog.summary",
          "blog.search_summary",
          "blog.image",
          "blog.publisher",
          "blog.publish_date",
        ],
        fetchLinks: ["author.title", "author.image", "author.linkedin"],
        orderings: { field: "my.blog.publish_date", direction: "desc" },
        filters,
      })
      .then((res) => {
        if (cancelled) return;
        setFetchedItems(res.results);
        setFetchedTotalPages(res.total_pages);
        setCompletedRequestKey(requestKey);
      })
      .catch(() => {
        if (cancelled) return;
        setFetchedItems([]);
        setFetchedTotalPages(1);
        setCompletedRequestKey(requestKey);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialState, requestKey]);

  const displayItems = isInitialState ? initialItems : (fetchedItems ?? []);
  const displayTotalPages = isInitialState
    ? initialTotalPages
    : (fetchedTotalPages ?? 1);
  const displayPage = isInitialState ? initialPage : pageParam;
  const hasActiveFilters =
    selectedCategoryUids.length > 0 ||
    selectedTagUids.length > 0 ||
    qParam.trim().length > 0;

  const categoryOptions = categories
    .filter((c) => c.data.title)
    .map((c) => ({ id: c.uid, label: c.data.title as string }));
  const tagOptions = tags
    .filter((t) => t.data.tag_name)
    .map((t) => ({ id: t.uid, label: t.data.tag_name as string }));

  const selectedCategoryChips = selectedCategoryUids
    .map((uid) => categoryOptions.find((c) => c.id === uid))
    .filter((c): c is { id: string; label: string } => Boolean(c));
  const selectedTagChips = selectedTagUids
    .map((uid) => tagOptions.find((t) => t.id === uid))
    .filter((t): t is { id: string; label: string } => Boolean(t));

  const removeCategory = (uid: string) =>
    router.push(
      buildUrl({ category: selectedCategoryUids.filter((id) => id !== uid) }),
    );
  const removeTag = (uid: string) =>
    router.push(buildUrl({ tags: selectedTagUids.filter((id) => id !== uid) }));

  return (
    <div className="pt-common-space">
      <div className="flex flex-col gap-4 xl:flex-row-reverse xl:items-end xl:justify-between">
        <div className="w-full xl:max-w-100">
          <StyledInput
            label="Search blog posts:"
            labelClassName="text-title-base font-medium mb-3 block"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div>
          <span className="text-title-base font-medium mb-3">Filter By:</span>
          <div className="flex flex-wrap items-center gap-3">
            {categoryOptions.length > 0 && (
              <div className="w-40">
                <CheckboxDropdown
                  label="Category"
                  options={categoryOptions}
                  selectedIds={selectedCategoryUids}
                  onApply={(ids) => router.push(buildUrl({ category: ids }))}
                />
              </div>
            )}
            {tagOptions.length > 0 && (
              <div className="w-40">
                <CheckboxDropdown
                  label="Tag"
                  options={tagOptions}
                  selectedIds={selectedTagUids}
                  onApply={(ids) => router.push(buildUrl({ tags: ids }))}
                />
              </div>
            )}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => router.push(basePath)}
                className="text-body-base font-medium underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {(selectedCategoryChips.length > 0 || selectedTagChips.length > 0) && (
        <ul className="flex flex-wrap items-center gap-2 pt-3">
          {selectedCategoryChips.map((chip) => (
            <li key={`category-${chip.id}`}>
              <button
                type="button"
                onClick={() => removeCategory(chip.id)}
                aria-label={`Remove ${chip.label} filter`}
                className="inline-flex items-center gap-1.5 rounded-full bg-offwhite px-3 py-1.5 text-[12px] text-text-heading"
              >
                {chip.label}
                <Close size={16} color="#000" />
              </button>
            </li>
          ))}
          {selectedTagChips.map((chip) => (
            <li key={`tag-${chip.id}`}>
              <button
                type="button"
                onClick={() => removeTag(chip.id)}
                aria-label={`Remove ${chip.label} filter`}
                className="inline-flex items-center gap-1.5 rounded-full bg-offwhite px-3 py-1.5 text-[12px] text-text-heading"
              >
                {chip.label}
                <Close size={16} color="#000" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {displayItems.length ? (
        <ul
          className={clsx(
            "grid pt-common-space gap-x-5.5 gap-y-6 md:gap-y-8 sm:grid-cols-2 lg:grid-cols-3 transition-opacity",
            isLoading && "opacity-50",
          )}
        >
          {displayItems.map((item) => (
            <BlogTemplate
              key={item.id}
              item={item}
              backgroundColor={backgroundColor}
            />
          ))}
        </ul>
      ) : (
        <EmptyState
          title={
            hasActiveFilters
              ? "No posts match your filters"
              : "No blog posts found"
          }
          description={
            hasActiveFilters
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Please check back soon — new content is on its way."
          }
        />
      )}

      {isInitialState ? (
        <StyledPagination
          currentPage={displayPage}
          totalPageCount={displayTotalPages}
          firstPage={initialFirstPage}
        />
      ) : (
        <ClientPagination
          currentPage={displayPage}
          totalPageCount={displayTotalPages}
          onNavigate={(page) => router.push(buildUrl({ page }))}
        />
      )}
    </div>
  );
};

export default BlogFilterBar;
