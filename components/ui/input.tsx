import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export const Input = (props: TextInputProps) => {
  return <TextInput style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
