import { CartItem, DeliveryOption, Order, OrderItem, PaymentMethodId, Product } from '../types/models';
import { generateId, generateOrderNumber } from '../utils/id';
import { isoNow, addDays } from '../utils/date';

export const deliveryOptions: DeliveryOption[] = [
  { id: 'standard', label: 'Standard', timing: 'Tue 8 Sep', price: 1500, etaDays: 3 },
  { id: 'express', label: 'Express', timing: 'Tomorrow', price: 4000, etaDays: 1 },
];

export function computeCartTotals(
  items: CartItem[],
  productsById: Record<string, Product>,
  deliveryFee: number,
  couponDiscount: number,
  walletBalance: number,
) {
  const subtotal = items.reduce((sum, i) => sum + i.priceAtAdd * i.qty, 0);
  const walletApplied = Math.min(walletBalance, Math.max(0, subtotal - couponDiscount));
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount - walletApplied);
  return { subtotal, deliveryFee, discount: couponDiscount, walletApplied, total };
}

export function buildOrder(params: {
  items: CartItem[];
  productsById: Record<string, Product>;
  addressId: string;
  deliveryOptionId: DeliveryOption['id'];
  paymentMethod: PaymentMethodId;
  totals: { subtotal: number; deliveryFee: number; discount: number; walletApplied: number; total: number };
}): Order {
  const orderItems: OrderItem[] = params.items.map((i) => {
    const product = params.productsById[i.productId];
    return {
      productId: i.productId,
      title: product?.title ?? 'Product',
      image: product?.images?.[0] ?? '',
      variantColor: i.variantColor,
      qty: i.qty,
      price: i.priceAtAdd,
    };
  });

  const now = isoNow();
  const payIn4Plan =
    params.paymentMethod === 'pay_in_4'
      ? {
          installments: 4,
          amountPerInstallment: Math.round(params.totals.total / 4),
          paidCount: 1,
          nextDueDate: addDays(30),
        }
      : undefined;

  return {
    id: generateId('ord'),
    orderNumber: generateOrderNumber(),
    items: orderItems,
    subtotal: params.totals.subtotal,
    deliveryFee: params.totals.deliveryFee,
    discount: params.totals.discount,
    walletApplied: params.totals.walletApplied,
    total: params.totals.total,
    addressId: params.addressId,
    deliveryOptionId: params.deliveryOptionId,
    paymentMethod: params.paymentMethod,
    status: 'in_transit',
    payIn4Plan,
    createdAt: now,
    courier: { name: 'Emeka', phone: '0803 555 0199', provider: 'GIG Logistics', plate: 'LSD 442 XA' },
    statusEvents: [
      { status: 'paid', label: 'Paid', timestamp: now },
      { status: 'packed', label: 'Packed by seller', timestamp: addDays(0), detail: 'Lagos warehouse' },
      { status: 'in_transit', label: 'In transit', timestamp: addDays(1), detail: 'Left the hub, 4 stops away' },
      {
        status: 'delivered',
        label: 'Delivered',
        timestamp: addDays(params.deliveryOptionId === 'express' ? 1 : 3),
        detail: 'Expected 09:00–18:00',
      },
    ],
  };
}
