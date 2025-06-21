import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export const Textarea = (props: TextInputProps) => {
  return (
    <TextInput
      {...props}
      style={[styles.textarea, props.style]}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
    />
  );
};

const styles = StyleSheet.create({
  textarea: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
  },
});
