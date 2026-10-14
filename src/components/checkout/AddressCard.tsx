import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Address } from '../../types/models';
import { colors, radii, spacing, typography } from '../../theme';
import { Badge } from '../common/Badge';

export function AddressCard({ address, selected, onSelect }: { address: Address; selected: boolean; onSelect: () => void }) {
  return (
    <Pressable onPress={onSelect} style={[styles.card, selected && styles.selected]}>
      <View style={styles.radio}>
        {selected && <View style={styles.radioDot} />}
      </View>
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={typography.bodyStrong}>
            {address.fullName} · {address.phone}
          </Text>
          {address.isDefault && <Badge label="Default" />}
        </View>
        <Text style={typography.body}>{address.line1}</Text>
        <Text style={typography.caption}>
          {address.city}, {address.state}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
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
    marginTop: 2,
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  info: { flex: 1, gap: 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
