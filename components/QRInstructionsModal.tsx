import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function QRInstructionsModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>How to Scan</Text>
          <Text style={styles.text}>1. Open your phone's camera</Text>
          <Text style={styles.text}>2. Point it at the event QR code</Text>
          <Text style={styles.text}>3. Tap the link that appears</Text>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={{ color: '#fff' }}>Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: 'white', padding: 20, borderRadius: 12, width: '90%', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  text: { fontSize: 14, marginBottom: 8 },
  button: { marginTop: 16, backgroundColor: '#6366f1', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
});
