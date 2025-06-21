import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export function Button({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4f46e5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  label: { color: '#fff', fontWeight: 'bold' },
});
