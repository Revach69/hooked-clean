import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const RadioGroup = ({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity key={option} onPress={() => onChange(option)} style={styles.row}>
          <View style={[styles.radio, selected === option && styles.selected]} />
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
  },
  selected: {
    backgroundColor: '#333',
  },
});
