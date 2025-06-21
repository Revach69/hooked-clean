import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BreadcrumbProps {
  items: string[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <Text key={index} style={styles.item}>
          {item}
          {index < items.length - 1 && ' / '}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
  item: { color: '#999', marginRight: 4 },
});
