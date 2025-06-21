import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Command({ children }: { children: React.ReactNode }) {
  return <View style={styles.command}>{children}</View>;
}

const styles = StyleSheet.create({
  command: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 6,
    marginVertical: 4,
  },
});
