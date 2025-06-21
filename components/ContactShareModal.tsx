import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

interface Props {
  visible: boolean;
  matchName: string;
  onConfirm: (info: { fullName: string; phoneNumber: string }) => void;
  onClose: () => void;
}

export default function ContactShareModal({ visible, matchName, onConfirm, onClose }: Props) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShare = async () => {
    if (!fullName.trim() || !phoneNumber.trim()) return;
    setIsSubmitting(true);
    try {
      await onConfirm({ fullName: fullName.trim(), phoneNumber: phoneNumber.trim() });
    } catch {
      Alert.alert('Error', 'Failed to share contact info');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Share contact with {matchName}?</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn} disabled={isSubmitting}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} disabled={isSubmitting || !fullName.trim() || !phoneNumber.trim()} style={styles.shareBtn}>
              <Text style={{ color: 'white' }}>{isSubmitting ? 'Sharing...' : 'Share'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: 'white', padding: 20, borderRadius: 12, width: '90%' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { padding: 10 },
  shareBtn: { padding: 10, backgroundColor: '#6366f1', borderRadius: 8 },
});
