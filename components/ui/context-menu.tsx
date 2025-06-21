import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function ContextMenu({ options, onSelect }: { options: string[]; onSelect: (option: string) => void }) {
  return (
    <View style={styles.menu}>
      {options.map((option) => (
        <TouchableOpacity key={option} onPress={() => onSelect(option)} style={styles.option}>
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: { backgroundColor: '#fff', padding: 10, borderRadius: 8, shadowOpacity: 0.1, shadowRadius: 4 },
  option: { paddingVertical: 8 },
});
