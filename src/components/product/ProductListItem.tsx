import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../../types/models';
import { colors, radii, spacing, typography } from '../../theme';
import { ProductImage } from './ProductImage';
import { PriceTag } from '../common/PriceTag';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';

export function ProductListItem({ product, onPress }: { product: Product; onPress: () => void }) {
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 3;

  return (
    <Pressable onPress={onPress} style={[styles.row, outOfStock && styles.outOfStock]}>
      <ProductImage uri={product.images[0]} style={styles.image} />
      <View style={styles.info}>
        <Text numberOfLines={2} style={typography.body}>
          {product.title}
        </Text>
        <PriceTag price={product.price} originalPrice={product.originalPrice} />
        <RatingStars rating={product.rating} soldCount={product.soldCount} />
        <Text style={typography.caption}>{product.deliveryFrom}</Text>
        <View style={styles.badgeRow}>
          {outOfStock && <Badge label="Out of stock" tone="danger" />}
          {lowStock && <Badge label={`${product.stock} left`} tone="warning" />}
          {product.freeDelivery && !outOfStock && <Badge label="Free delivery" tone="primary" />}
          {product.payIn4Eligible && !outOfStock && <Badge label="Pay in 4" tone="neutral" />}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.md },
  outOfStock: { opacity: 0.55 },
  image: { width: 96, height: 96, borderRadius: radii.md },
  info: { flex: 1, gap: spacing.xs },
  badgeRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap', marginTop: spacing.xs },
});
