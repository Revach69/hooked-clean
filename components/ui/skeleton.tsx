import React from 'react';
import { View, StyleSheet } from 'react-native';

export function Skeleton({ style }: { style?: any }) {
  return <View style={[styles.skeleton, style]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#eee',
    borderRadius: 8,
    height: 20,
    width: '100%',
    marginVertical: 4,
  },
});
