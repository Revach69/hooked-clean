import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type ToggleGroupProps = {
  options: string[];
  selected: string;
  onChange: (val: string) => void;
};

export const ToggleGroup: React.FC<ToggleGroupProps> = ({ options, selected, onChange }) => {
  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          onPress={() => onChange(opt)}
          style={[styles.button, selected === opt && styles.active]}
        >
          <Text style={styles.text}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
  button: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#ddd',
    marginRight: 8,
  },
  active: {
    backgroundColor: '#333',
  },
  text: {
    color: 'white',
  },
});
