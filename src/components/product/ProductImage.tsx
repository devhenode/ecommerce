import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, radii } from '../../theme';

type Props = {
  uri: string;
  style?: ViewStyle;
  radius?: number;
};

export function ProductImage({ uri, style, radius = radii.md }: Props) {
  return (
    <View style={[styles.frame, { borderRadius: radius }, style]}>
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={150}
        placeholder={{ blurhash: 'L6Pj0^i_.AyE_3t7t7R**0o#DgR4' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
});
