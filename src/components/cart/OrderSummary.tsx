import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { formatNaira } from '../../utils/currency';

type Props = {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  walletApplied?: number;
  total: number;
};

export function OrderSummary({ itemCount, subtotal, deliveryFee, discount, walletApplied, total }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order summary</Text>
      <Row label={`${itemCount} item${itemCount === 1 ? '' : 's'}`} value={formatNaira(subtotal)} />
      <Row label="Delivery" value={formatNaira(deliveryFee)} />
      {!!discount && <Row label="Discount" value={`−${formatNaira(discount)}`} accent />}
      {!!walletApplied && <Row label="Wallet balance" value={`−${formatNaira(walletApplied)}`} accent />}
      <View style={styles.divider} />
      <Row label="Total" value={formatNaira(total)} strong />
    </View>
  );
}

function Row({ label, value, strong, accent }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={strong ? typography.h3 : typography.body}>{label}</Text>
      <Text
        style={[
          strong ? typography.h3 : typography.bodyStrong,
          accent && { color: colors.primaryDark },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  header: { ...typography.label, marginBottom: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
});
