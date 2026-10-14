import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';

type Tone = 'primary' | 'warning' | 'danger' | 'neutral';

export function Badge({ label, tone = 'primary' }: { label: string; tone?: Tone }) {
  return (
    <View style={[styles.base, toneStyles[tone].bg]}>
      <Text style={[styles.text, toneStyles[tone].text]}>{label}</Text>
    </View>
  );
}

const toneStyles: Record<Tone, { bg: object; text: object }> = {
  primary: { bg: { backgroundColor: colors.primaryTint }, text: { color: colors.primaryDark } },
  warning: { bg: { backgroundColor: colors.warningTint }, text: { color: colors.warning } },
  danger: { bg: { backgroundColor: colors.dangerTint }, text: { color: colors.danger } },
  neutral: { bg: { backgroundColor: colors.surface }, text: { color: colors.textMuted } },
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  text: { ...typography.captionStrong },
});
