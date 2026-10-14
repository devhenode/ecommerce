import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radii, spacing, typography } from '../../theme';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [providerLoading, setProviderLoading] = useState<'google' | 'apple' | null>(null);
  const [sendingCode, setSendingCode] = useState(false);
  const continueWithProvider = useAuthStore((s) => s.continueWithProvider);
  const sendOtp = useAuthStore((s) => s.sendOtp);

  async function handleProvider(provider: 'google' | 'apple') {
    setProviderLoading(provider);
    try {
      await continueWithProvider(provider);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } finally {
      setProviderLoading(null);
    }
  }

  async function handleSendCode() {
    if (phone.trim().length < 7) return;
    setSendingCode(true);
    try {
      await sendOtp(phone);
      navigation.navigate('Otp', { phone });
    } finally {
      setSendingCode(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
        <Ionicons name="chevron-back" size={22} color={colors.text} />
      </Pressable>

      <Text style={typography.h1}>Sign in to Henode</Text>
      <Text style={styles.subtitle}>Your cart, addresses and orders follow you across devices.</Text>

      <View style={styles.providerGroup}>
        <Pressable style={styles.providerBtn} onPress={() => handleProvider('google')} disabled={!!providerLoading}>
          {providerLoading === 'google' ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <>
              <Ionicons name="logo-google" size={18} color={colors.text} />
              <Text style={styles.providerText}>Continue with Google</Text>
            </>
          )}
        </Pressable>
        <Pressable style={styles.providerBtn} onPress={() => handleProvider('apple')} disabled={!!providerLoading}>
          {providerLoading === 'apple' ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <>
              <Ionicons name="logo-apple" size={18} color={colors.text} />
              <Text style={styles.providerText}>Continue with Apple</Text>
            </>
          )}
        </Pressable>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <Text style={styles.label}>PHONE NUMBER</Text>
      <View style={styles.phoneRow}>
        <View style={styles.countryCode}>
          <Text style={typography.bodyStrong}>+234</Text>
        </View>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="801 234 5678"
          placeholderTextColor={colors.textMuted}
          style={styles.phoneInput}
        />
      </View>

      <Button
        label="Send code"
        onPress={handleSendCode}
        loading={sendingCode}
        disabled={phone.trim().length < 7}
        style={styles.sendBtn}
      />

      <Text style={styles.terms}>By continuing you agree to Henode's terms of sale and privacy notice.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.xl },
  providerGroup: { gap: spacing.md },
  providerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
  },
  providerText: { ...typography.bodyStrong },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { ...typography.caption },
  label: { ...typography.label, marginBottom: spacing.sm },
  phoneRow: { flexDirection: 'row', gap: spacing.sm },
  countryCode: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    ...typography.body,
  },
  sendBtn: { marginTop: spacing.lg },
  terms: { ...typography.caption, textAlign: 'center', marginTop: spacing.xl },
});
