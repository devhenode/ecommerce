import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { colors, radii, spacing, typography } from '../../theme';
import { ProductListItem } from '../../components/product/ProductListItem';
import { EmptyState } from '../../components/common/EmptyState';
import { productRepository } from '../../data/repositories/productRepository';
import { Product } from '../../types/models';
import { useFilterStore } from '../../store/filterStore';
import { FilterSheet } from './FilterSheet';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function SearchResultsScreen({ navigation, route }: Props) {
  const [query, setQuery] = useState(route.params?.query ?? '');
  const [results, setResults] = useState<Product[]>([]);
  const { filters, setFilters, activeCount } = useFilterStore();
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    productRepository.search(query, filters).then(setResults);
  }, [query, filters]);

  function applyFilters(next: typeof filters) {
    setFilters(next);
    sheetRef.current?.dismiss();
  }

  const activeChips: string[] = [];
  if (filters.priceMax != null) activeChips.push(`Under ₦${filters.priceMax / 1000}k`);
  if (filters.minRating != null) activeChips.push(`${filters.minRating}★ up`);
  if (filters.freeDeliveryOnly) activeChips.push('Free ship');
  if (filters.payIn4Only) activeChips.push('Pay in 4');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrap}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search products"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            autoFocus={!route.params?.query}
          />
        </View>
        <Pressable style={styles.filterBtn} onPress={() => sheetRef.current?.present()}>
          <Ionicons name="options-outline" size={16} color={colors.text} />
          <Text style={typography.captionStrong}>Filters</Text>
          {activeCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeCount()}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {activeChips.length > 0 && (
        <View style={styles.chipsRow}>
          {activeChips.map((c) => (
            <View key={c} style={styles.activeChip}>
              <Text style={styles.activeChipText}>{c}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.resultCount}>{results.length} results</Text>

      <FlatList
        data={results}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <ProductListItem product={item} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })} />
        )}
        ListEmptyComponent={<EmptyState icon="search-outline" title="No products found" subtitle="Try a different search or adjust filters." />}
      />

      <FilterSheet ref={sheetRef} initialFilters={filters} resultCount={results.length} onApply={applyFilters} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  searchRow: { flexDirection: 'row', gap: spacing.sm, paddingTop: spacing.md },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchInput: { flex: 1, ...typography.body },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBadge: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  filterBadgeText: { color: colors.textOnPrimary, fontSize: 10, fontWeight: '700' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.md },
  activeChip: { backgroundColor: colors.primaryTint, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radii.pill },
  activeChipText: { ...typography.captionStrong, color: colors.primaryDark },
  resultCount: { ...typography.caption, marginTop: spacing.md },
  listContent: { paddingBottom: spacing.xxxl },
  separator: { height: 1, backgroundColor: colors.border },
});
