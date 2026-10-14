import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../../theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  selected: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
};

export function PaymentMethodRow({ icon, title, subtitle, selected, onSelect, children }: Props) {
  return (
    <Pressable onPress={onSelect} style={[styles.card, selected && styles.selected]}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={18} color={colors.primaryDark} />
        </View>
        <View style={styles.info}>
          <Text style={typography.bodyStrong}>{title}</Text>
          {subtitle && <Text style={typography.caption}>{subtitle}</Text>}
        </View>
        <View style={styles.radio}>{selected && <View style={styles.radioDot} />}</View>
      </View>
      {selected && children ? <View style={styles.children}>{children}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  selected: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
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
  children: { marginTop: spacing.md },
});
