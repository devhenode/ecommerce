import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';
import { StepIndicator } from '../../components/common/StepIndicator';
import { AddressCard } from '../../components/checkout/AddressCard';
import { AddressFormSheet } from '../../components/checkout/AddressFormSheet';
import { DeliveryOptionRadio } from '../../components/checkout/DeliveryOptionRadio';
import { OrderSummary } from '../../components/cart/OrderSummary';
import { Button } from '../../components/common/Button';
import { useAddressStore } from '../../store/addressStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { productRepository } from '../../data/repositories/productRepository';
import { findCoupon } from '../../data/catalog/coupons';
import { Product, DeliverySpeedId, PaymentMethodId } from '../../types/models';
import { computeCartTotals, deliveryOptions, buildOrder } from '../../services/checkoutService';
import { PaymentSheet } from './PaymentSheet';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export function CheckoutScreen({ navigation }: Props) {
  const { addresses, selectedAddressId, addAddress, selectAddress } = useAddressStore();
  const { items, couponCode, clear: clearCart } = useCartStore();
  const session = useAuthStore((s) => s.session);
  const adjustWallet = useAuthStore((s) => s.adjustWallet);
  const addOrder = useOrderStore((s) => s.addOrder);

  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeedId>('standard');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [productsById, setProductsById] = useState<Record<string, Product>>({});
  const paymentSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    Promise.all(items.map((i) => productRepository.getById(i.productId))).then((list) => {
      const map: Record<string, Product> = {};
      list.forEach((p) => {
        if (p) map[p.id] = p;
      });
      setProductsById(map);
    });
  }, [items]);

  const coupon = couponCode ? findCoupon(couponCode) : undefined;
  const subtotal = items.reduce((sum, i) => sum + i.priceAtAdd * i.qty, 0);
  const couponDiscount = coupon
    ? coupon.type === 'percent'
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal)
    : 0;
  const deliveryOption = deliveryOptions.find((d) => d.id === deliverySpeed)!;
  const totals = computeCartTotals(items, productsById, deliveryOption.price, couponDiscount, session?.walletBalance ?? 0);

  function handlePaymentSuccess(method: PaymentMethodId) {
    if (!selectedAddressId) return;
    const order = buildOrder({
      items,
      productsById,
      addressId: selectedAddressId,
      deliveryOptionId: deliverySpeed,
      paymentMethod: method,
      totals,
    });
    addOrder(order);
    adjustWallet(-totals.walletApplied);
    clearCart();
    navigation.reset({
      index: 1,
      routes: [{ name: 'Main' }, { name: 'OrderTracking', params: { orderId: order.id } }],
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={typography.h1}>Checkout</Text>
        <StepIndicator steps={['ADDRESS', 'PAY']} activeIndex={0} />

        <Text style={styles.sectionLabel}>DELIVER TO</Text>
        <View style={styles.addressList}>
          {addresses.map((a) => (
            <AddressCard key={a.id} address={a} selected={selectedAddressId === a.id} onSelect={() => selectAddress(a.id)} />
          ))}
        </View>
        <Text onPress={() => setShowAddressForm(true)} style={styles.addAddress}>
          + Add a new address
        </Text>

        <Text style={styles.sectionLabel}>DELIVERY SPEED</Text>
        <View style={styles.addressList}>
          {deliveryOptions.map((opt) => (
            <DeliveryOptionRadio key={opt.id} option={opt} selected={deliverySpeed === opt.id} onSelect={() => setDeliverySpeed(opt.id)} />
          ))}
        </View>

        <View style={styles.summaryWrap}>
          <OrderSummary
            itemCount={items.reduce((s, i) => s + i.qty, 0)}
            subtotal={totals.subtotal}
            deliveryFee={totals.deliveryFee}
            discount={totals.discount}
            walletApplied={totals.walletApplied}
            total={totals.total}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue to payment"
          onPress={() => paymentSheetRef.current?.present()}
          disabled={!selectedAddressId || items.length === 0}
        />
      </View>

      <AddressFormSheet visible={showAddressForm} onClose={() => setShowAddressForm(false)} onSave={addAddress} />
      <PaymentSheet
        ref={paymentSheetRef}
        amount={totals.total}
        walletBalance={session?.walletBalance ?? 0}
        onSuccess={handlePaymentSuccess}
        onBackToCart={() => {
          paymentSheetRef.current?.dismiss();
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.md },
  sectionLabel: { ...typography.label, marginTop: spacing.lg },
  addressList: { gap: spacing.sm, marginTop: spacing.sm },
  addAddress: { ...typography.bodyStrong, color: colors.primary, marginTop: spacing.md },
  summaryWrap: { marginTop: spacing.xl, padding: spacing.md, backgroundColor: colors.surface, borderRadius: 12 },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
});
