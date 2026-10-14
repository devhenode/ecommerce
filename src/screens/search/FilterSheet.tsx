import React, { forwardRef, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { colors, spacing, typography } from '../../theme';
import { Chip } from '../../components/common/Chip';
import { Button } from '../../components/common/Button';
import { ProductFilters } from '../../types/models';

const PRICE_PRESETS: { label: string; value?: number }[] = [
  { label: 'Any', value: undefined },
  { label: 'Under ₦5k', value: 5000 },
  { label: 'Under ₦20k', value: 20000 },
  { label: 'Under ₦50k', value: 50000 },
];

const RATING_PRESETS: { label: string; value?: number }[] = [
  { label: 'Any', value: undefined },
  { label: '3★ up', value: 3 },
  { label: '4★ up', value: 4 },
];

type Props = {
  initialFilters: ProductFilters;
  resultCount: number;
  onApply: (filters: ProductFilters) => void;
};

export const FilterSheet = forwardRef<BottomSheetModal, Props>(({ initialFilters, resultCount, onApply }, ref) => {
  const [draft, setDraft] = useState<ProductFilters>(initialFilters);
  const snapPoints = useMemo(() => ['60%'], []);

  function reset() {
    setDraft({});
  }

  function show() {
    setDraft(initialFilters);
  }

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onChange={(index) => index === 0 && show()}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={typography.h2}>Filters</Text>
          <Text onPress={reset} style={styles.reset}>
            Reset
          </Text>
        </View>

        <Text style={styles.sectionLabel}>PRICE, ₦</Text>
        <View style={styles.chipRow}>
          {PRICE_PRESETS.map((p) => (
            <Chip
              key={p.label}
              label={p.label}
              selected={draft.priceMax === p.value}
              onPress={() => setDraft({ ...draft, priceMax: p.value })}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>RATING</Text>
        <View style={styles.chipRow}>
          {RATING_PRESETS.map((p) => (
            <Chip
              key={p.label}
              label={p.label}
              selected={draft.minRating === p.value}
              onPress={() => setDraft({ ...draft, minRating: p.value })}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>DELIVERY</Text>
        <View style={styles.chipRow}>
          <Chip
            label="Free delivery"
            selected={!!draft.freeDeliveryOnly}
            onPress={() => setDraft({ ...draft, freeDeliveryOnly: !draft.freeDeliveryOnly })}
          />
          <Chip
            label="Pay in 4"
            selected={!!draft.payIn4Only}
            onPress={() => setDraft({ ...draft, payIn4Only: !draft.payIn4Only })}
          />
        </View>

        <Button
          label={`Show ${resultCount} results`}
          onPress={() => onApply(draft)}
          style={styles.applyBtn}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

FilterSheet.displayName = 'FilterSheet';

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.sm },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reset: { ...typography.bodyStrong, color: colors.primary },
  sectionLabel: { ...typography.label, marginTop: spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  applyBtn: { marginTop: spacing.xl },
});
