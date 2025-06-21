import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Pagination = ({ current, total }: { current: number; total: number }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Page {current} of {total}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 10 },
  text: { fontSize: 16, color: '#555' },
});
