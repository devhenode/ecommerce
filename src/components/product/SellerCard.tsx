import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Seller } from '../../types/models';
import { colors, radii, spacing, typography } from '../../theme';

export function SellerCard({ seller }: { seller: Seller }) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={typography.bodyStrong}>{seller.name}</Text>
        <Text style={typography.caption}>
          {seller.positivePercent}% positive · Ships from {seller.shipsFrom}
        </Text>
      </View>
      <Pressable style={styles.visitBtn}>
        <Text style={styles.visitText}>Visit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
  },
  info: { gap: 2, flex: 1 },
  visitBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  visitText: { ...typography.captionStrong, color: colors.text },
});
