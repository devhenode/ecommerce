import { mockDelay } from '../mockDelay';
import { PaymentMethodId } from '../../types/models';
import { generatePaymentReference } from '../../utils/id';

export type ChargeResult =
  | { ok: true; reference: string }
  | { ok: false; reference: string; reason: string; cardLast4?: string };

/**
 * Simulated Paystack charge. No network call is made — this is the seam a real
 * Paystack integration would replace. Passing `forceFail` (surfaced only in
 * __DEV__ via the payment sheet) lets us demo the failure screen on demand.
 */
export function charge(method: PaymentMethodId, _amount: number, options?: { forceFail?: boolean }): Promise<ChargeResult> {
  const reference = generatePaymentReference();
  if (options?.forceFail) {
    return mockDelay(
      { ok: false, reference, reason: 'Your bank rejected the charge.', cardLast4: '4417' },
      1400,
    );
  }
  return mockDelay({ ok: true, reference }, 1400);
}

export const paymentRepository = { charge };
