import React, { forwardRef, useMemo, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../../theme';
import { PaymentMethodRow } from '../../components/payment/PaymentMethodRow';
import { InstallmentBreakdown } from '../../components/payment/InstallmentBreakdown';
import { Button } from '../../components/common/Button';
import { formatNaira } from '../../utils/currency';
import { PaymentMethodId } from '../../types/models';
import { charge, ChargeResult } from '../../data/repositories/paymentRepository';

type Stage = 'methods' | 'processing' | 'failed';

type Props = {
  amount: number;
  walletBalance: number;
  onSuccess: (method: PaymentMethodId) => void;
  onBackToCart: () => void;
};

export const PaymentSheet = forwardRef<BottomSheetModal, Props>(({ amount, walletBalance, onSuccess, onBackToCart }, ref) => {
  const [method, setMethod] = useState<PaymentMethodId>('card');
  const [saveCard, setSaveCard] = useState(false);
  const [stage, setStage] = useState<Stage>('methods');
  const [forceFail, setForceFail] = useState(false);
  const [failResult, setFailResult] = useState<ChargeResult | null>(null);
  const snapPoints = useMemo(() => ['75%'], []);

  async function handlePay() {
    setStage('processing');
    const result = await charge(method, amount, { forceFail });
    if (result.ok) {
      setStage('methods');
      onSuccess(method);
    } else {
      setFailResult(result);
      setStage('failed');
    }
  }

  function handleTryAnother() {
    setStage('methods');
    setFailResult(null);
  }

  function handleSheetChange(index: number) {
    if (index === 0) {
      setStage('methods');
      setFailResult(null);
    }
  }

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />}
    >
      <BottomSheetScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {stage === 'failed' && failResult && !failResult.ok ? (
          <View style={styles.failedWrap}>
            <View style={styles.failIcon}>
              <Ionicons name="close" size={28} color={colors.danger} />
            </View>
            <Text style={typography.h2}>Payment was declined</Text>
            <Text style={styles.failText}>
              Your bank rejected the charge on card ending {failResult.cardLast4 ?? '****'}. Nothing was taken.
            </Text>
            <Text style={styles.reference}>Reference {failResult.reference}</Text>

            <View style={styles.holdBanner}>
              <Ionicons name="time-outline" size={16} color={colors.warning} />
              <Text style={styles.holdText}>Your cart is held for 30 minutes. Low-stock items are not reserved.</Text>
            </View>

            <Button label="Try another method" onPress={handleTryAnother} style={styles.actionSpacing} />
            <Button label="Back to cart" variant="ghost" onPress={onBackToCart} />
          </View>
        ) : (
          <>
            <Text style={typography.h1}>Pay {formatNaira(amount)}</Text>
            <View style={styles.securedRow}>
              <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
              <Text style={typography.caption}>Secured by Paystack</Text>
            </View>

            <View style={styles.methods}>
              <PaymentMethodRow icon="card-outline" title="Card" selected={method === 'card'} onSelect={() => setMethod('card')}>
                <View style={styles.saveCardRow}>
                  <Switch value={saveCard} onValueChange={setSaveCard} trackColor={{ true: colors.primary }} />
                  <Text style={typography.body}>Save this card for next time</Text>
                </View>
              </PaymentMethodRow>

              <PaymentMethodRow
                icon="business-outline"
                title="Bank transfer"
                subtitle="One-time account, expires in 30 min"
                selected={method === 'bank_transfer'}
                onSelect={() => setMethod('bank_transfer')}
              />

              <PaymentMethodRow
                icon="wallet-outline"
                title="Henode wallet"
                subtitle={`${formatNaira(walletBalance)} available`}
                selected={method === 'wallet'}
                onSelect={() => setMethod('wallet')}
              />

              <PaymentMethodRow icon="calendar-outline" title="Pay in 4" selected={method === 'pay_in_4'} onSelect={() => setMethod('pay_in_4')}>
                <InstallmentBreakdown total={amount} />
              </PaymentMethodRow>
            </View>

            {__DEV__ && (
              <View style={styles.devRow}>
                <Switch value={forceFail} onValueChange={setForceFail} trackColor={{ true: colors.danger }} />
                <Text style={typography.caption}>Force failure (dev only)</Text>
              </View>
            )}

            <Button label={`Pay ${formatNaira(amount)}`} onPress={handlePay} loading={stage === 'processing'} style={styles.payBtn} />
            <Text style={styles.disclaimer}>You will be asked for your card PIN or OTP.</Text>
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

PaymentSheet.displayName = 'PaymentSheet';

const styles = StyleSheet.create({
  content: { flex: 1 },
  contentContainer: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  securedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs, marginBottom: spacing.lg },
  methods: { gap: spacing.md },
  saveCardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  devRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg },
  payBtn: { marginTop: spacing.xl },
  disclaimer: { ...typography.caption, textAlign: 'center', marginTop: spacing.md },
  failedWrap: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.lg },
  failIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dangerTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  failText: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  reference: { ...typography.caption, marginBottom: spacing.md },
  holdBanner: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.warningTint,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  holdText: { ...typography.caption, color: colors.warning, flex: 1 },
  actionSpacing: { marginTop: spacing.lg, width: '100%' },
});
