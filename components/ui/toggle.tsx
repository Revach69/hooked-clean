import React from 'react';
import { Switch } from 'react-native';

type ToggleProps = {
  value: boolean;
  onValueChange: (val: boolean) => void;
};

export const Toggle = ({ value, onValueChange }: ToggleProps) => {
  return <Switch value={value} onValueChange={onValueChange} />;
};
