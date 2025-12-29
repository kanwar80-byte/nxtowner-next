import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

export type AssetType = 'Operational' | 'Digital';

export function useListingFilters() {
  // Text search
  const [query, setQuery] = useQueryState('query', parseAsString.withDefault(''));

  // Asset type enum (loose type)
  const [assetType, setAssetType] = useQueryState('asset_type', parseAsString.withDefault(''));

  // Main category
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault(''));

  // Price range (loose type)
  const [minPrice, setMinPrice] = useQueryState('min_price', parseAsInteger.withDefault(0));
  const [maxPrice, setMaxPrice] = useQueryState('max_price', parseAsInteger.withDefault(0));

  // Pagination
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  return {
    query,
    setQuery,
    assetType,
    setAssetType,
    category,
    setCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    page,
    setPage,
  };
}
