import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

export type AssetType = 'Operational' | 'Digital';

export function useListingFilters() {
  // Text search
  const [query, setQuery] = useQueryState('query', parseAsString.withDefault(''));

  // Asset type enum
  const [assetType, setAssetType] = useQueryState<AssetType | undefined>(
    'asset_type',
    parseAsString.withDefault(undefined)
  );

  // Main category
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault(''));

  // Price range
  const [minPrice, setMinPrice] = useQueryState('min_price', parseAsInteger.withDefault(undefined));
  const [maxPrice, setMaxPrice] = useQueryState('max_price', parseAsInteger.withDefault(undefined));

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
