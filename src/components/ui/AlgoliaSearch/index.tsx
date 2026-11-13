"use client";
import React from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  SearchBox,
  useInstantSearch,
} from "react-instantsearch";
import type { BaseHit, Hit as AlgoliaHit } from "instantsearch.js";
import Link from "next/link";
import clsx from "clsx";

interface SearchRecord extends BaseHit {
  url?: string;
  type?: string;
  title?: string;
  meta_description?: string;
  summary?: string;
  content?: string;
}

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID || "test-app-id",
  process.env.NEXT_PUBLIC_ALGOLIA_KEY || "test-secret",
);

export const Hit = ({ hit }: { hit: AlgoliaHit<SearchRecord> }) => {
  return (
    <Link href={hit.url || "/"}>
      <div className="hit-title">
        <span
          className={
            "border border-gray-500 rounded-[3px] py-[2px] px-2 inline-block mb-1 text-caption"
          }
        >
          {hit.type}
        </span>
        <br />
        <strong className={"text-heading6"}>
          <Highlight attribute="title" hit={hit} />
        </strong>
      </div>
      <div className="hit-summary">
        <Highlight attribute="meta_description" hit={hit} />
        <Highlight attribute="summary" hit={hit} />
        <Highlight attribute="content" hit={hit} />
      </div>
    </Link>
  );
};

interface AlgoliaSearchProps {
  callback?: () => void;
}

const AlgoliaSearch = ({ callback }: AlgoliaSearchProps) => {
  return (
    <div
      className={clsx({
        "w-full max-w-[500px] mx-auto mb-12": true,
      })}
    >
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure hitsPerPage={5} />
        <div className="ais-InstantSearch">
          <SearchBox placeholder={"Type end enter to search..."} autoFocus />
          <NoResultsBoundary callback={callback}>
            <Hits hitComponent={Hit} />
          </NoResultsBoundary>
        </div>
      </InstantSearch>
    </div>
  );
};

export default AlgoliaSearch;

interface NoResultsBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  callback?: () => void;
}

const NoResultsBoundary = ({
  children,
  fallback,
  callback = () => null,
}: NoResultsBoundaryProps) => {
  const { results, indexUiState } = useInstantSearch();
  if (!indexUiState.query) {
    return <></>;
  }
  if (!results?.__isArtificial && results.nbHits === 0) {
    return <>{fallback}</>;
  }
  return (
    <div onClick={callback} role={"presentation"}>
      {children}
    </div>
  );
};
