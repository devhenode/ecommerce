import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from '../types/models';
import { seedOrders } from '../data/repositories/orderRepository';

type OrderState = {
  orders: Order[];
  addOrder: (order: Order) => void;
  getById: (id: string) => Order | undefined;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: seedOrders,
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      getById: (id) => get().orders.find((o) => o.id === id),
    }),
    {
      name: 'henode-orders',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
