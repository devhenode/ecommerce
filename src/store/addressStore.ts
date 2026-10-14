import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../types/models';
import { seedAddresses } from '../data/repositories/addressRepository';
import { generateId } from '../utils/id';

type AddressState = {
  addresses: Address[];
  selectedAddressId: string | null;
  addAddress: (address: Omit<Address, 'id' | 'isDefault'>) => void;
  selectAddress: (id: string) => void;
};

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: seedAddresses,
      selectedAddressId: seedAddresses.find((a) => a.isDefault)?.id ?? seedAddresses[0]?.id ?? null,

      addAddress: (address) => {
        const newAddress: Address = { ...address, id: generateId('addr'), isDefault: false };
        set({ addresses: [...get().addresses, newAddress], selectedAddressId: newAddress.id });
      },

      selectAddress: (id) => set({ selectedAddressId: id }),
    }),
    {
      name: 'henode-addresses',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
