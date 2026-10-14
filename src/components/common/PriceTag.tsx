import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { formatNaira } from '../../utils/currency';

type Props = {
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  size?: 'md' | 'lg';
};

export function PriceTag({ price, originalPrice, discountPercent, size = 'md' }: Props) {
  return (
    <View style={styles.row}>
      <Text style={size === 'lg' ? typography.priceLarge : typography.price}>{formatNaira(price)}</Text>
      {originalPrice != null && (
        <Text style={styles.original}>{formatNaira(originalPrice)}</Text>
      )}
      {discountPercent != null && (
        <Text style={styles.discount}>−{discountPercent}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  original: { ...typography.caption, textDecorationLine: 'line-through' },
  discount: { ...typography.captionStrong, color: colors.danger },
});
