import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { colors } from '../theme';
import { HomeScreen } from '../screens/home/HomeScreen';
import { SearchResultsScreen } from '../screens/search/SearchResultsScreen';
import { CartScreen } from '../screens/cart/CartScreen';
import { OrderHistoryScreen } from '../screens/orders/OrderHistoryScreen';
import { useCartStore } from '../store/cartStore';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  Search: 'search-outline',
  Cart: 'cart-outline',
  Account: 'person-outline',
};

export function MainTabs() {
  const cartCount = useCartStore((s) => s.totalCount());

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
        tabBarBadge: route.name === 'Cart' && cartCount > 0 ? cartCount : undefined,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchResultsScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Account" component={OrderHistoryScreen} />
    </Tab.Navigator>
  );
}
