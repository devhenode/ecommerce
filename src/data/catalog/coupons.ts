import { Coupon } from '../../types/models';

export const coupons: Coupon[] = [
  { code: 'WELCOME10', type: 'percent', value: 10, minSubtotal: 5000 },
  { code: 'SAVE5K', type: 'flat', value: 5000, minSubtotal: 40000 },
  { code: 'HENODE20', type: 'percent', value: 20, minSubtotal: 100000 },
];

export function findCoupon(code: string): Coupon | undefined {
  return coupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
}
