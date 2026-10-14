import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../../theme';

type Props = {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
};

export function QtyStepper({ qty, onChange, min = 1, max = 99 }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onChange(Math.max(min, qty - 1))}
        disabled={qty <= min}
        style={[styles.btn, qty <= min && styles.btnDisabled]}
      >
        <Ionicons name="remove" size={16} color={colors.text} />
      </Pressable>
      <Text style={styles.qty}>{qty}</Text>
      <Pressable
        onPress={() => onChange(Math.min(max, qty + 1))}
        disabled={qty >= max}
        style={[styles.btn, qty >= max && styles.btnDisabled]}
      >
        <Ionicons name="add" size={16} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
  },
  btn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.35 },
  qty: { ...typography.bodyStrong, minWidth: 24, textAlign: 'center' },
});
