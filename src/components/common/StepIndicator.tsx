import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export function StepIndicator({ steps, activeIndex }: { steps: string[]; activeIndex: number }) {
  return (
    <View style={styles.row}>
      {steps.map((label, index) => {
        const isActive = index === activeIndex;
        const isDone = index < activeIndex;
        return (
          <React.Fragment key={label}>
            <View style={styles.step}>
              <View style={[styles.circle, (isActive || isDone) && styles.circleActive]}>
                <Text style={[styles.circleText, (isActive || isDone) && styles.circleTextActive]}>{index + 1}</Text>
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
            </View>
            {index < steps.length - 1 && <View style={styles.connector} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: { backgroundColor: colors.primary },
  circleText: { ...typography.captionStrong, color: colors.textMuted },
  circleTextActive: { color: colors.textOnPrimary },
  label: { ...typography.captionStrong, color: colors.textMuted },
  labelActive: { color: colors.text },
  connector: { width: 24, height: 1, backgroundColor: colors.border, marginHorizontal: spacing.sm },
});
