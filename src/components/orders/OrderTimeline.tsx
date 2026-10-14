import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order, OrderStatus, OrderStatusEvent } from '../../types/models';
import { colors, spacing, typography } from '../../theme';
import { formatDateTime } from '../../utils/date';

const STAGES: { status: OrderStatus; label: string }[] = [
  { status: 'paid', label: 'Paid' },
  { status: 'packed', label: 'Packed by seller' },
  { status: 'in_transit', label: 'In transit' },
  { status: 'delivered', label: 'Delivered' },
];

function findEvent(events: OrderStatusEvent[], status: OrderStatus) {
  return events.find((e) => e.status === status);
}

export function OrderTimeline({ order }: { order: Order }) {
  let reachedIndex = -1;
  STAGES.forEach((stage, index) => {
    if (findEvent(order.statusEvents, stage.status)) reachedIndex = index;
  });

  return (
    <View>
      {STAGES.map((stage, index) => {
        const event = findEvent(order.statusEvents, stage.status);
        const isDone = index <= reachedIndex;
        const isLast = index === STAGES.length - 1;
        return (
          <View key={stage.status} style={styles.row}>
            <View style={styles.markerCol}>
              <View style={[styles.dot, isDone && styles.dotDone]}>
                {isDone && <Ionicons name="checkmark" size={12} color={colors.textOnPrimary} />}
              </View>
              {!isLast && <View style={[styles.line, isDone && index < reachedIndex && styles.lineDone]} />}
            </View>
            <View style={styles.content}>
              <Text style={[typography.bodyStrong, !isDone && styles.pending]}>{stage.label}</Text>
              {event ? (
                <Text style={typography.caption}>
                  {isDone ? formatDateTime(event.timestamp) : `Expected ${formatDateTime(event.timestamp)}`}
                  {event.detail ? ` · ${event.detail}` : ''}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  markerCol: { alignItems: 'center', width: 24 },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.primary },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: 2 },
  lineDone: { backgroundColor: colors.primary },
  content: { flex: 1, paddingBottom: spacing.lg },
  pending: { color: colors.textMuted },
});
