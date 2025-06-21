import React from 'react';
import { View, Text } from 'react-native';

export const HoverCard = ({ children }: { children: React.ReactNode }) => {
  return <View>{children}</View>;
};

export const HoverCardTrigger = HoverCard;
export const HoverCardContent = ({ children }: { children: React.ReactNode }) => {
  return <Text>{children}</Text>;
};
