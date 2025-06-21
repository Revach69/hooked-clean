import React from 'react';
import { View } from 'react-native';

export function AspectRatio({
  ratio = 1,
  children,
}: {
  ratio: number;
  children: React.ReactNode;
}) {
  return <View style={{ aspectRatio: ratio }}>{children}</View>;
}
