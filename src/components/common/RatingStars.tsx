import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

function abbreviate(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${n}`;
}

export function RatingStars({ rating, soldCount }: { rating: number; soldCount?: number }) {
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={12} color={colors.star} />
      <Text style={styles.text}>{rating.toFixed(1)}</Text>
      {soldCount != null && <Text style={styles.text}> · {abbreviate(soldCount)} sold</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  text: { ...typography.caption },
});
