import { Address } from '../../types/models';

export const seedAddresses: Address[] = [
  {
    id: 'addr_1',
    label: 'Home',
    fullName: 'Adaeze Okafor',
    phone: '0801 234 5678',
    line1: '14 Herbert Macaulay Way, Flat 3B',
    city: 'Yaba',
    state: 'Lagos 101245',
    isDefault: true,
  },
  {
    id: 'addr_2',
    label: 'Office',
    fullName: 'Henode Office',
    phone: '0809 887 1122',
    line1: '7 Admiralty Way',
    city: 'Lekki Phase 1',
    state: 'Lagos',
    isDefault: false,
  },
];
