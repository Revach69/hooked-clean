import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';

interface ContactShareModalProps {
  visible: boolean;
  onClose: () => void;
}

const ContactShareModal: React.FC<ContactShareModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Share Contact Info</Text>
        </View>
      </View>
    </Modal>
  );
};

export default ContactShareModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
