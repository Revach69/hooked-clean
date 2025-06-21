import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

export const Label = ({ children, style, ...rest }: TextProps) => {
  return (
    <Text style={[styles.label, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 14,
    color: '#333',
  },
});
