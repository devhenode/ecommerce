import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radii, spacing, typography } from '../../theme';
import { useOrderStore } from '../../store/orderStore';
import { OrderTimeline } from '../../components/orders/OrderTimeline';
import { CourierCard } from '../../components/orders/CourierCard';
import { ProductImage } from '../../components/product/ProductImage';
import { formatNaira } from '../../utils/currency';
import { formatDay } from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderTracking'>;

export function OrderTrackingScreen({ navigation, route }: Props) {
  const order = useOrderStore((s) => s.getById(route.params.orderId));

  if (!order) return <SafeAreaView style={styles.container} />;

  const deliveredEvent = order.statusEvents.find((e) => e.status === 'delivered');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={typography.h2}>Order tracking</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.confirmedBanner}>
          <Ionicons name="checkmark-circle" size={20} color={colors.primaryDark} />
          <Text style={styles.confirmedText}>PAYMENT CONFIRMED</Text>
        </View>

        {deliveredEvent && <Text style={typography.h1}>Arriving {formatDay(deliveredEvent.timestamp)}</Text>}
        <Text style={typography.caption}>
          Order {order.orderNumber} · {order.items.reduce((s, i) => s + i.qty, 0)} items ·{' '}
          {formatNaira(order.total)} paid
        </Text>

        <View style={styles.timelineWrap}>
          <OrderTimeline order={order} />
        </View>

        {order.courier && <CourierCard courier={order.courier} />}

        <Text style={styles.sectionLabel}>IN THIS ORDER</Text>
        <View style={styles.itemsList}>
          {order.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <ProductImage uri={item.image} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text numberOfLines={2} style={typography.body}>
                  {item.title}
                </Text>
                {item.variantColor && <Text style={typography.caption}>{item.variantColor}</Text>}
              </View>
              <Text style={typography.bodyStrong}>{formatNaira(item.price * item.qty)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <Pressable style={styles.actionBtn}>
            <Text style={styles.actionText}>Get receipt</Text>
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <Text style={styles.actionText}>Contact seller</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  confirmedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryTint,
    padding: spacing.md,
    borderRadius: radii.md,
    alignSelf: 'flex-start',
  },
  confirmedText: { ...typography.captionStrong, color: colors.primaryDark },
  timelineWrap: { marginTop: spacing.lg },
  sectionLabel: { ...typography.label, marginTop: spacing.lg },
  itemsList: { gap: spacing.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  itemImage: { width: 48, height: 48, borderRadius: radii.sm },
  itemInfo: { flex: 1, gap: 2 },
  actionsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
  },
  actionText: { ...typography.bodyStrong },
});
