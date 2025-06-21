import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Drawer({ visible, onClose, children }: DrawerProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.drawer}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0006',
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
