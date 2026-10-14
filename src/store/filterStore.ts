import { create } from 'zustand';
import { ProductFilters } from '../types/models';

type FilterState = {
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  reset: () => void;
  activeCount: () => number;
};

const empty: ProductFilters = {};

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: empty,
  setFilters: (filters) => set({ filters }),
  reset: () => set({ filters: empty }),
  activeCount: () => {
    const f = get().filters;
    let count = 0;
    if (f.priceMax != null) count += 1;
    if (f.minRating != null) count += 1;
    if (f.freeDeliveryOnly) count += 1;
    if (f.payIn4Only) count += 1;
    return count;
  },
}));
