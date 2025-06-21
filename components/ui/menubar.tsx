import React from 'react';
import { View } from 'react-native';

export const Menubar = ({ children }: { children: React.ReactNode }) => {
  return <View>{children}</View>;
};

export const MenubarItem = Menubar;
export const MenubarContent = Menubar;
export const MenubarTrigger = Menubar;
