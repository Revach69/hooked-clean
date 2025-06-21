import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

export function ScrollArea({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollArea}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollArea: {
    padding: 10,
  },
});
