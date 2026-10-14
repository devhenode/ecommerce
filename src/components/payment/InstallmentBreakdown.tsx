import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '../../theme';
import { formatNaira } from '../../utils/currency';

export function InstallmentBreakdown({ total, installments = 4 }: { total: number; installments?: number }) {
  const amount = Math.round(total / installments);
  return (
    <View style={styles.container}>
      <Text style={typography.body}>
        {installments} × {formatNaira(amount)}, no interest
      </Text>
      <Text style={typography.caption}>Eligibility check applies</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { gap: 2 } });
