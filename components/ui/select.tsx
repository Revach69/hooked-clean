import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export function Select({ items, onValueChange, value }: any) {
  return (
    <View>
      <Text>Select an option:</Text>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={items}
        value={value}
      />
    </View>
  );
}
