import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoRow}>
        <View style={styles.logoMark}>
          <Ionicons name="storefront-outline" size={22} color={colors.textOnPrimary} />
        </View>
        <Text style={styles.logoText}>HENODE</Text>
      </View>

      <View style={styles.illustration}>
        <Ionicons name="pricetags-outline" size={72} color={colors.primary} />
      </View>

      <View style={styles.copy}>
        <Text style={typography.display}>Everything, listed and priced.</Text>
        <Text style={styles.subtitle}>
          Search a catalog of thousands of items, pay how you like, track it to your door.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label="Get started" onPress={() => navigation.navigate('SignIn')} />
        <Button
          label="Browse without an account"
          variant="ghost"
          onPress={async () => {
            await continueAsGuest();
            navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, justifyContent: 'space-between' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { ...typography.h2, letterSpacing: 2 },
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    marginVertical: spacing.xl,
  },
  copy: { gap: spacing.sm, marginBottom: spacing.xl },
  subtitle: { ...typography.body, color: colors.textMuted },
  actions: { gap: spacing.md, marginBottom: spacing.lg },
});
