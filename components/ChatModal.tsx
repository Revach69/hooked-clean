import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.text}>Chat Modal Placeholder</Text>
        </View>
      </View>
    </Modal>
  );
};

export default ChatModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
