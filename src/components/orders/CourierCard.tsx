import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Courier } from '../../types/models';
import { colors, radii, spacing, typography } from '../../theme';

export function CourierCard({ courier }: { courier: Courier }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="bicycle-outline" size={20} color={colors.primaryDark} />
      </View>
      <View style={styles.info}>
        <Text style={typography.bodyStrong}>
          {courier.name} · {courier.provider}
        </Text>
        <Text style={typography.caption}>
          Rider · plate {courier.plate}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { gap: 2 },
});
