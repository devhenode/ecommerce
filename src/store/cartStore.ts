import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '../types/models';
import { generateId } from '../utils/id';
import { findCoupon } from '../data/catalog/coupons';

type CartState = {
  items: CartItem[];
  couponCode: string | null;
  addItem: (product: Product, qty: number, variantColor?: string) => void;
  updateQty: (itemId: string, qty: number) => void;
  removeItem: (itemId: string) => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  clearCoupon: () => void;
  clear: () => void;
  totalCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,

      addItem: (product, qty, variantColor) => {
        const existing = get().items.find(
          (i) => i.productId === product.id && i.variantColor === variantColor,
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id ? { ...i, qty: i.qty + qty } : i,
            ),
          });
          return;
        }
        const newItem: CartItem = {
          id: generateId('cart'),
          productId: product.id,
          variantColor,
          qty,
          priceAtAdd: product.price,
        };
        set({ items: [...get().items, newItem] });
      },

      updateQty: (itemId, qty) => {
        if (qty <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({ items: get().items.map((i) => (i.id === itemId ? { ...i, qty } : i)) });
      },

      removeItem: (itemId) => set({ items: get().items.filter((i) => i.id !== itemId) }),

      applyCoupon: (code) => {
        const coupon = findCoupon(code);
        if (!coupon) return { ok: false, message: 'Invalid coupon code' };
        set({ couponCode: coupon.code });
        return { ok: true, message: `${coupon.code} applied` };
      },

      clearCoupon: () => set({ couponCode: null }),

      clear: () => set({ items: [], couponCode: null }),

      totalCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: 'henode-cart',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
