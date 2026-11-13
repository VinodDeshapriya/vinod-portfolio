import React from "react";
import dynamicImport from "next/dynamic";
import { hasAlgoliaSearch } from "@/utils/algoliaSearch";

const AlgoliaSearchOverlayWrapper = dynamicImport(
  () =>
    import("@/components/ui/AlgoliaSearch/AlgoliaSearchModal/OverlayWrapper"),
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {hasAlgoliaSearch && <AlgoliaSearchOverlayWrapper />}
    </>
  );
}
