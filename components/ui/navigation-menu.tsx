import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const NavigationMenu = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.menu}>{children}</View>;
};

const styles = StyleSheet.create({
  menu: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});
