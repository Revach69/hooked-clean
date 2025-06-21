import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

export function AppSlider({ value, onValueChange }: any) {
  return (
    <View>
      <Slider
        value={value}
        onValueChange={onValueChange}
        minimumValue={0}
        maximumValue={100}
      />
      <Text>{value}</Text>
    </View>
  );
}
