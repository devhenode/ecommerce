import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Order } from '../../types/models';
import { colors, radii, spacing, typography } from '../../theme';
import { formatNaira } from '../../utils/currency';
import { formatDay } from '../../utils/date';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

type Props = {
  order: Order;
  onTrack: () => void;
  onBuyAgain: () => void;
};

const statusTone: Record<Order['status'], { label: string; tone: 'primary' | 'warning' | 'danger' | 'neutral' }> = {
  paid: { label: 'Paid', tone: 'neutral' },
  packed: { label: 'Packed', tone: 'neutral' },
  in_transit: { label: 'In transit', tone: 'primary' },
  delivered: { label: 'Delivered', tone: 'neutral' },
  refunded: { label: 'Refunded', tone: 'danger' },
};

export function OrderCard({ order, onTrack, onBuyAgain }: Props) {
  const summary = order.items.length === 1 ? order.items[0].title : `${order.items.length} items`;
  const status = statusTone[order.status];
  const deliveredEvent = order.statusEvents.find((e) => e.status === 'delivered');

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={typography.bodyStrong}>{order.orderNumber}</Text>
        <Badge label={status.label} tone={status.tone} />
      </View>

      <Text style={typography.body}>
        {summary}
        {order.status === 'in_transit' ? ` · arriving ${formatDay(order.statusEvents.find((e) => e.status === 'delivered')!.timestamp)}` : ''}
        {order.status === 'delivered' && deliveredEvent ? ` · Delivered ${formatDay(deliveredEvent.timestamp)}` : ''}
        {order.status === 'refunded' ? ' · returned' : ''}
      </Text>

      {order.payIn4Plan && (
        <Text style={typography.caption}>
          Pay in 4 · {order.payIn4Plan.paidCount} of {order.payIn4Plan.installments} paid · next{' '}
          {formatNaira(order.payIn4Plan.amountPerInstallment)} on {formatDay(order.payIn4Plan.nextDueDate)}
        </Text>
      )}

      <View style={styles.footerRow}>
        <Text style={typography.h3}>{formatNaira(order.total)}</Text>
        <View style={styles.actions}>
          {order.status === 'in_transit' && <Button label="Track order" onPress={onTrack} variant="secondary" />}
          {order.status === 'delivered' && (
            <>
              <Button label="Rate" onPress={onTrack} variant="ghost" />
              <Button label="Buy again" onPress={onBuyAgain} variant="secondary" />
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  actions: { flexDirection: 'row', gap: spacing.sm },
});
