import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  text: string;
}

export function Badge({ text }: BadgeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
    color: '#333',
  },
});
