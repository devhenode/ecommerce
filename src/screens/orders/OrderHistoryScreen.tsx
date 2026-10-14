import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';
import { useOrderStore } from '../../store/orderStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { productRepository } from '../../data/repositories/productRepository';
import { OrderCard } from '../../components/orders/OrderCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Chip } from '../../components/common/Chip';
import { formatNaira } from '../../utils/currency';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Account'>,
  NativeStackScreenProps<RootStackParamList>
>;

type FilterTab = 'all' | 'active' | 'delivered';

export function OrderHistoryScreen({ navigation }: Props) {
  const orders = useOrderStore((s) => s.orders);
  const addItem = useCartStore((s) => s.addItem);
  const { session, signOut } = useAuthStore();
  const [tab, setTab] = useState<FilterTab>('all');

  const filtered = orders.filter((o) => {
    if (tab === 'active') return o.status === 'in_transit' || o.status === 'paid' || o.status === 'packed';
    if (tab === 'delivered') return o.status === 'delivered';
    return true;
  });

  async function handleBuyAgain(orderId: string) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    for (const item of order.items) {
      const product = await productRepository.getById(item.productId);
      if (product) addItem(product, item.qty, item.variantColor);
    }
    navigation.navigate('Cart');
  }

  function handleSignOut() {
    signOut();
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <View>
            <Text style={typography.h1}>{session?.isGuest ? 'Guest' : session?.name ?? session?.phone ?? 'Your account'}</Text>
            <Text style={typography.caption}>Wallet balance {formatNaira(session?.walletBalance ?? 0)}</Text>
          </View>
          <Pressable onPress={handleSignOut} hitSlop={8}>
            <Ionicons name="log-out-outline" size={22} color={colors.textMuted} />
          </Pressable>
        </View>
        <Text style={styles.sectionLabel}>YOUR ORDERS</Text>
      </View>

      <View style={styles.tabsRow}>
        <Chip label="All" selected={tab === 'all'} onPress={() => setTab('all')} />
        <Chip label="Active" selected={tab === 'active'} onPress={() => setTab('active')} />
        <Chip label="Delivered" selected={tab === 'delivered'} onPress={() => setTab('delivered')} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onTrack={() => navigation.navigate('OrderTracking', { orderId: item.id })}
            onBuyAgain={() => handleBuyAgain(item.id)}
          />
        )}
        ListEmptyComponent={<EmptyState icon="receipt-outline" title="No orders yet" subtitle="Orders you place will show up here." />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { ...typography.label, marginTop: spacing.lg },
  tabsRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, marginTop: spacing.md },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
});
