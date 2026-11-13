import { hasAlgoliaSearch } from "@/utils/algoliaSearch";
import dynamic from "next/dynamic";
const SearchOverlay = dynamic(() => import("./overlay"));

const AlgoliaSearchOverlayWrapper = async () => {
  if (!hasAlgoliaSearch) return null;

  return <SearchOverlay />;
};

export default AlgoliaSearchOverlayWrapper;
