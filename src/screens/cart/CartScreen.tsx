import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { productRepository } from '../../data/repositories/productRepository';
import { findCoupon } from '../../data/catalog/coupons';
import { Product } from '../../types/models';
import { CartLineItem } from '../../components/cart/CartLineItem';
import { CouponRow } from '../../components/cart/CouponRow';
import { OrderSummary } from '../../components/cart/OrderSummary';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { computeCartTotals, deliveryOptions } from '../../services/checkoutService';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Cart'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function CartScreen({ navigation }: Props) {
  const { items, couponCode, updateQty, removeItem, applyCoupon, clearCoupon } = useCartStore();
  const session = useAuthStore((s) => s.session);
  const [productsById, setProductsById] = useState<Record<string, Product>>({});
  const [editing, setEditing] = useState(false);

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
  const deliveryFee = items.length > 0 ? deliveryOptions[0].price : 0;
  const totals = computeCartTotals(items, productsById, deliveryFee, couponDiscount, session?.walletBalance ?? 0);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.header}>Cart</Text>
        <EmptyState icon="cart-outline" title="Your cart is empty" subtitle="Browse products and add them to your cart." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={typography.h1}>Cart · {items.reduce((s, i) => s + i.qty, 0)} items</Text>
        <Text onPress={() => setEditing(!editing)} style={styles.editText}>
          {editing ? 'Done' : 'Edit'}
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const product = productsById[item.productId];
          if (!product) return null;
          return (
            <CartLineItem
              item={item}
              product={product}
              editing={editing}
              onQtyChange={(qty) => updateQty(item.id, qty)}
              onRemove={() => removeItem(item.id)}
            />
          );
        }}
        ListFooterComponent={
          <View style={styles.footerContent}>
            <CouponRow appliedCode={couponCode} onApply={applyCoupon} onClear={clearCoupon} />
            <OrderSummary
              itemCount={items.reduce((s, i) => s + i.qty, 0)}
              subtotal={totals.subtotal}
              deliveryFee={totals.deliveryFee}
              discount={totals.discount}
              walletApplied={totals.walletApplied}
              total={totals.total}
            />
          </View>
        }
      />

      <View style={styles.checkoutBar}>
        <Button label="Checkout" onPress={() => navigation.navigate('Checkout')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  header: { ...typography.h1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  editText: { ...typography.bodyStrong, color: colors.primary },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  separator: { height: 1, backgroundColor: colors.border },
  footerContent: { marginTop: spacing.lg, gap: spacing.xl },
  checkoutBar: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
});
