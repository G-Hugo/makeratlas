import type { Machine } from "@/types/machine";

export interface CatalogEntry {
  primary: Machine;
  powerTiers: Machine[];
  displayName: string;
  priceMin: number;
  priceMax: number;
}
