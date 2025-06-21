import React from 'react';
import { View, StyleSheet } from 'react-native';

interface FormProps {
  children: React.ReactNode;
}

export function Form({ children }: FormProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
