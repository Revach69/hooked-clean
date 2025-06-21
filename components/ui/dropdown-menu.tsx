import React, { useState } from 'react';
import { Menu, Provider } from 'react-native-paper';

interface DropdownMenuProps {
  items: string[];
  onSelect: (item: string) => void;
}

export function DropdownMenu({ items, onSelect }: DropdownMenuProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Provider>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={{ x: 0, y: 0 }}
      >
        {items.map((item, index) => (
          <Menu.Item key={index} onPress={() => { setVisible(false); onSelect(item); }} title={item} />
        ))}
      </Menu>
    </Provider>
  );
}
