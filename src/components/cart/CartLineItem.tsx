import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem, Product } from '../../types/models';
import { colors, radii, spacing, typography } from '../../theme';
import { ProductImage } from '../product/ProductImage';
import { QtyStepper } from '../common/QtyStepper';
import { Badge } from '../common/Badge';
import { formatNaira } from '../../utils/currency';

type Props = {
  item: CartItem;
  product: Product;
  editing: boolean;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
};

export function CartLineItem({ item, product, editing, onQtyChange, onRemove }: Props) {
  const lowStock = product.stock > 0 && product.stock <= 3;

  return (
    <View style={styles.row}>
      <ProductImage uri={product.images[0]} style={styles.image} />
      <View style={styles.info}>
        <Text numberOfLines={2} style={typography.body}>
          {product.title}
        </Text>
        {item.variantColor && <Text style={typography.caption}>{item.variantColor}</Text>}
        {lowStock && <Badge label={`Only ${product.stock} left`} tone="warning" />}
        <View style={styles.bottomRow}>
          <QtyStepper qty={item.qty} onChange={onQtyChange} />
          <Text style={typography.price}>{formatNaira(item.priceAtAdd * item.qty)}</Text>
        </View>
      </View>
      {editing && (
        <Pressable onPress={onRemove} style={styles.removeBtn} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.md, alignItems: 'flex-start' },
  image: { width: 72, height: 72, borderRadius: radii.md },
  info: { flex: 1, gap: spacing.xs },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  removeBtn: { padding: spacing.xs },
});
