import { TextStyle } from 'react-native';
import { colors } from './colors';

type TypeStyle = Pick<TextStyle, 'fontSize' | 'fontWeight' | 'lineHeight' | 'color' | 'letterSpacing'>;

export const typography: Record<string, TypeStyle> = {
  display: { fontSize: 28, fontWeight: '700', lineHeight: 34, color: colors.text },
  h1: { fontSize: 22, fontWeight: '700', lineHeight: 28, color: colors.text },
  h2: { fontSize: 18, fontWeight: '700', lineHeight: 24, color: colors.text },
  h3: { fontSize: 16, fontWeight: '600', lineHeight: 22, color: colors.text },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 20, color: colors.text },
  bodyStrong: { fontSize: 14, fontWeight: '600', lineHeight: 20, color: colors.text },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16, color: colors.textMuted },
  captionStrong: { fontSize: 12, fontWeight: '600', lineHeight: 16, color: colors.textMuted },
  label: { fontSize: 11, fontWeight: '700', lineHeight: 14, color: colors.textMuted, letterSpacing: 0.6 },
  price: { fontSize: 16, fontWeight: '700', lineHeight: 20, color: colors.text },
  priceLarge: { fontSize: 24, fontWeight: '700', lineHeight: 30, color: colors.text },
};
