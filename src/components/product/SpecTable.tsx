import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProductSpec } from '../../types/models';
import { colors, spacing, typography } from '../../theme';

export function SpecTable({ specs }: { specs: ProductSpec[] }) {
  return (
    <View style={styles.table}>
      {specs.map((spec, i) => (
        <View key={spec.label} style={[styles.row, i < specs.length - 1 && styles.divider]}>
          <Text style={styles.label}>{spec.label}</Text>
          <Text style={styles.value}>{spec.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { ...typography.body, color: colors.textMuted },
  value: { ...typography.bodyStrong },
});
