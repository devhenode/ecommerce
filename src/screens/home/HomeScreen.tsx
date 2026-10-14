import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { colors, radii, spacing, typography } from '../../theme';
import { Chip } from '../../components/common/Chip';
import { ProductCard } from '../../components/product/ProductCard';
import { productRepository } from '../../data/repositories/productRepository';
import { Category, Product } from '../../types/models';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('cat_all');
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const [cats, list] = await Promise.all([
      productRepository.listCategories(),
      productRepository.listByCategory(selectedCategory),
    ]);
    setCategories(cats);
    setProducts(list);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <Text style={styles.logo}>HENODE</Text>
              <Pressable style={styles.locationPill}>
                <Ionicons name="location-outline" size={14} color={colors.primaryDark} />
                <Text style={styles.locationText}>Yaba, Lagos</Text>
              </Pressable>
            </View>

            <Pressable style={styles.searchBar} onPress={() => navigation.navigate('Search', {})}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted} />
              <Text style={styles.searchPlaceholder}>Search 40,000+ items</Text>
            </Pressable>

            <Text style={styles.sectionLabel}>CATEGORIES</Text>
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(c) => c.id}
              contentContainerStyle={styles.categoryList}
              renderItem={({ item }) => (
                <Chip
                  label={item.name}
                  selected={selectedCategory === item.id}
                  onPress={() => setSelectedCategory(item.id)}
                />
              )}
            />

            <Text style={styles.sectionLabel}>POPULAR THIS WEEK</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  column: { justifyContent: 'space-between' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.md },
  logo: { ...typography.h2, letterSpacing: 2 },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  locationText: { ...typography.captionStrong, color: colors.primaryDark },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    height: 44,
    marginTop: spacing.lg,
  },
  searchPlaceholder: { ...typography.body, color: colors.textMuted },
  sectionLabel: { ...typography.label, marginTop: spacing.xl, marginBottom: spacing.md },
  categoryList: { gap: spacing.sm },
});
