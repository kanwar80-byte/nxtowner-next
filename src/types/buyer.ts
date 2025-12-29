// src/types/buyer.ts
export type BuyerPreferences = {
  assetTypes?: string[];
  categories?: string[];
  regions?: string[];
  minPrice?: number | null;
  maxPrice?: number | null;
  [key: string]: any;
};
