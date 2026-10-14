export type Category = {
  id: string;
  name: string;
  icon: string;
  slug: string;
};

export type ProductColor = { name: string; hex: string };
export type ProductSpec = { label: string; value: string };

export type Product = {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  sellerId: string;
  images: string[];
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  ratingCount: number;
  soldCount: number;
  stock: number;
  sku: string;
  colors?: ProductColor[];
  specs: ProductSpec[];
  description: string;
  deliveryEtaDays: number;
  deliveryFrom: string;
  freeDelivery: boolean;
  payIn4Eligible: boolean;
};

export type Seller = {
  id: string;
  name: string;
  rating: number;
  positivePercent: number;
  shipsFrom: string;
  productCount: number;
};

export type CartItem = {
  id: string;
  productId: string;
  variantColor?: string;
  qty: number;
  priceAtAdd: number;
};

export type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  isDefault: boolean;
};

export type DeliverySpeedId = 'standard' | 'express';

export type DeliveryOption = {
  id: DeliverySpeedId;
  label: string;
  timing: string;
  price: number;
  etaDays: number;
};

export type Coupon = {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minSubtotal?: number;
};

export type PaymentMethodId = 'card' | 'bank_transfer' | 'wallet' | 'pay_in_4';

export type OrderStatus = 'paid' | 'packed' | 'in_transit' | 'delivered' | 'refunded';

export type OrderStatusEvent = {
  status: OrderStatus;
  label: string;
  timestamp: string;
  detail?: string;
};

export type OrderItem = {
  productId: string;
  title: string;
  image: string;
  variantColor?: string;
  qty: number;
  price: number;
};

export type PayIn4Plan = {
  installments: number;
  amountPerInstallment: number;
  paidCount: number;
  nextDueDate: string;
};

export type Courier = { name: string; phone: string; provider: string; plate: string };

export type Order = {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  walletApplied: number;
  total: number;
  addressId: string;
  deliveryOptionId: DeliverySpeedId;
  paymentMethod: PaymentMethodId;
  status: OrderStatus;
  payIn4Plan?: PayIn4Plan;
  createdAt: string;
  courier?: Courier;
  statusEvents: OrderStatusEvent[];
};

export type Session = {
  id: string;
  name?: string;
  phone?: string;
  isGuest: boolean;
  walletBalance: number;
};

export type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'rating';

export type ProductFilters = {
  priceMax?: number;
  minRating?: number;
  freeDeliveryOnly?: boolean;
  payIn4Only?: boolean;
  sortBy?: SortOption;
};
