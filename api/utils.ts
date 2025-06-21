// lib/utils.ts (TypeScript version)
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export function mergeStyles(...styles: (StyleProp<ViewStyle | TextStyle> | undefined)[]) {
  return styles.filter(Boolean);
}
