import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radii, spacing, typography } from '../../theme';
import { productRepository } from '../../data/repositories/productRepository';
import { Product, Seller } from '../../types/models';
import { ImageCarousel } from '../../components/product/ImageCarousel';
import { PriceTag } from '../../components/common/PriceTag';
import { ColorSwatchSelector } from '../../components/product/ColorSwatchSelector';
import { SpecTable } from '../../components/product/SpecTable';
import { SellerCard } from '../../components/product/SellerCard';
import { QtyStepper } from '../../components/common/QtyStepper';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatNaira } from '../../utils/currency';
import { useCartStore } from '../../store/cartStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ navigation, route }: Props) {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [color, setColor] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    productRepository.getById(productId).then((p) => {
      if (!p) return;
      setProduct(p);
      setColor(p.colors?.[0]?.name);
      productRepository.getSeller(p.sellerId).then((s) => setSeller(s ?? null));
    });
  }, [productId]);

  if (!product) return <SafeAreaView style={styles.container} />;

  const outOfStock = product.stock === 0;

  function handleAddToCart() {
    if (!product || outOfStock) return;
    addItem(product, qty, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View>
          <ImageCarousel images={product.images} />
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.statusRow}>
            {outOfStock ? <Badge label="Out of stock" tone="danger" /> : <Badge label="In stock" tone="primary" />}
            <Text style={typography.caption}>SKU {product.sku}</Text>
          </View>

          <Text style={typography.h2}>{product.title}</Text>
          <PriceTag price={product.price} originalPrice={product.originalPrice} discountPercent={product.discountPercent} size="lg" />
          {product.payIn4Eligible && (
            <Text style={typography.caption}>
              or 4 × {formatNaira(Math.round(product.price / 4))} with Henode Pay in 4
            </Text>
          )}

          {seller && <SellerCard seller={seller} />}

          {product.colors && product.colors.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>COLOUR</Text>
              <ColorSwatchSelector colorOptions={product.colors} selected={color ?? ''} onSelect={setColor} />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SPECIFICATION</Text>
            <SpecTable specs={product.specs} />
          </View>

          <View style={styles.deliveryRow}>
            <Ionicons name="cube-outline" size={16} color={colors.textMuted} />
            <Text style={typography.caption}>
              {product.freeDelivery ? 'Free delivery' : 'Delivery'} to {product.deliveryFrom}, arrives in {product.deliveryEtaDays} days
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <QtyStepper qty={qty} onChange={setQty} max={Math.max(1, product.stock)} />
        <Button
          label={outOfStock ? 'Out of stock' : added ? 'Added ✓' : 'Add to cart'}
          onPress={handleAddToCart}
          disabled={outOfStock}
          style={styles.addBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xxxl },
  backBtn: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: spacing.lg, gap: spacing.md },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  section: { gap: spacing.sm },
  sectionLabel: { ...typography.label },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  addBtn: { flex: 1 },
});
