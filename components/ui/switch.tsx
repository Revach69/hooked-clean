import React from 'react';
import { Switch as RNSwitch } from 'react-native';

export function Switch({ value, onValueChange }: any) {
  return <RNSwitch value={value} onValueChange={onValueChange} />;
}
