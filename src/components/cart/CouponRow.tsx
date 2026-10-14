import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';
import { Button } from '../common/Button';

type Props = {
  appliedCode: string | null;
  onApply: (code: string) => { ok: boolean; message: string };
  onClear: () => void;
};

export function CouponRow({ appliedCode, onApply, onClear }: Props) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  function handleApply() {
    if (!code.trim()) return;
    const result = onApply(code);
    setMessage(result.message);
    if (result.ok) setCode('');
  }

  return (
    <View style={styles.container}>
      {appliedCode ? (
        <View style={styles.appliedRow}>
          <Text style={typography.bodyStrong}>Coupon {appliedCode} applied</Text>
          <Text onPress={onClear} style={styles.remove}>
            Remove
          </Text>
        </View>
      ) : (
        <View style={styles.row}>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Coupon code"
            autoCapitalize="characters"
            style={styles.input}
            placeholderTextColor={colors.textMuted}
          />
          <Button label="Apply" onPress={handleApply} variant="secondary" />
        </View>
      )}
      {message && !appliedCode && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.sm },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    ...typography.body,
  },
  appliedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  remove: { ...typography.captionStrong, color: colors.danger },
  message: { ...typography.caption, color: colors.danger },
});
