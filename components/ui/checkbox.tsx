import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
}

export function Checkbox({ checked, onToggle, label }: CheckboxProps) {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.container}>
      <View style={[styles.box, checked && styles.boxChecked]} />
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8,
  },
  boxChecked: {
    backgroundColor: '#333',
  },
  label: {
    fontSize: 14,
  },
});
