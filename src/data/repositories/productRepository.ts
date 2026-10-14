import { products } from '../catalog/products';
import { categories } from '../catalog/categories';
import { sellers } from '../catalog/sellers';
import { mockDelay } from '../mockDelay';
import { Product, ProductFilters, Category, Seller } from '../../types/models';

function applyFilters(list: Product[], filters?: ProductFilters): Product[] {
  let result = [...list];
  if (filters?.priceMax != null) {
    result = result.filter((p) => p.price <= filters.priceMax!);
  }
  if (filters?.minRating != null) {
    result = result.filter((p) => p.rating >= filters.minRating!);
  }
  if (filters?.freeDeliveryOnly) {
    result = result.filter((p) => p.freeDelivery);
  }
  if (filters?.payIn4Only) {
    result = result.filter((p) => p.payIn4Eligible);
  }
  switch (filters?.sortBy) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      result.sort((a, b) => b.soldCount - a.soldCount);
  }
  return result;
}

export const productRepository = {
  listCategories(): Promise<Category[]> {
    return mockDelay(categories, 150);
  },

  listPopular(): Promise<Product[]> {
    const popular = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8);
    return mockDelay(popular);
  },

  listByCategory(categoryId: string): Promise<Product[]> {
    const list = categoryId === 'cat_all' ? products : products.filter((p) => p.categoryId === categoryId);
    return mockDelay(list);
  },

  search(query: string, filters?: ProductFilters): Promise<Product[]> {
    const q = query.trim().toLowerCase();
    const matched = q ? products.filter((p) => p.title.toLowerCase().includes(q)) : [...products];
    return mockDelay(applyFilters(matched, filters), 350);
  },

  getById(id: string): Promise<Product | undefined> {
    return mockDelay(products.find((p) => p.id === id));
  },

  getSeller(sellerId: string): Promise<Seller | undefined> {
    return mockDelay(sellers.find((s) => s.id === sellerId), 150);
  },
};
