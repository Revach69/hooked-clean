import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Progress = ({ value = 0 }: { value: number }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width: `${value}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4f46e5',
  },
});
