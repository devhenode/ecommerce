import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ProductColor } from '../../types/models';
import { colors, spacing } from '../../theme';

type Props = {
  colorOptions: ProductColor[];
  selected: string;
  onSelect: (name: string) => void;
};

export function ColorSwatchSelector({ colorOptions, selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {colorOptions.map((c) => (
        <Pressable
          key={c.name}
          onPress={() => onSelect(c.name)}
          style={[styles.swatch, { backgroundColor: c.hex }, selected === c.name && styles.selected]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: { borderWidth: 3, borderColor: colors.primary },
});
