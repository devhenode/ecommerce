import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../../types/models';
import { colors, radii, spacing, typography } from '../../theme';
import { ProductImage } from './ProductImage';
import { PriceTag } from '../common/PriceTag';
import { RatingStars } from '../common/RatingStars';

export function ProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <ProductImage uri={product.images[0]} style={styles.image} />
      <Text numberOfLines={2} style={styles.title}>
        {product.title}
      </Text>
      <PriceTag price={product.price} originalPrice={product.originalPrice} />
      <RatingStars rating={product.rating} soldCount={product.soldCount} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: '48%', gap: spacing.xs, marginBottom: spacing.lg },
  image: { width: '100%', aspectRatio: 1, borderRadius: radii.md },
  title: { ...typography.body, minHeight: 36 },
});
