import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DeliveryOption } from '../../types/models';
import { colors, radii, spacing, typography } from '../../theme';
import { formatNaira } from '../../utils/currency';

export function DeliveryOptionRadio({
  option,
  selected,
  onSelect,
}: {
  option: DeliveryOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable onPress={onSelect} style={[styles.card, selected && styles.selected]}>
      <View style={styles.radio}>{selected && <View style={styles.radioDot} />}</View>
      <View style={styles.info}>
        <Text style={typography.bodyStrong}>
          {option.label}, {option.timing}
        </Text>
        <Text style={typography.caption}>{option.id === 'express' ? 'Order before 6pm' : `${option.etaDays} working days`}</Text>
      </View>
      <Text style={typography.bodyStrong}>{formatNaira(option.price)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  info: { flex: 1, gap: 2 },
});
