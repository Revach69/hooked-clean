import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Alert({ type = 'info', children }: { type?: 'info' | 'error' | 'success'; children: React.ReactNode }) {
  return (
    <View style={[styles.alert, styles[type]]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  info: { backgroundColor: '#dbeafe' },
  error: { backgroundColor: '#fecaca' },
  success: { backgroundColor: '#bbf7d0' },
  text: { fontSize: 14 },
});
