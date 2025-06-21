import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

type Props = {
  isVisible: boolean;
  eventName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmationDialog({ isVisible, eventName, onConfirm, onCancel }: Props) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      onBackButtonPress={onCancel}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      useNativeDriver
    >
      <View style={styles.container}>
        <Text style={styles.title}>Are you absolutely sure?</Text>
        <Text style={styles.description}>
          This will permanently delete the event{' '}
          <Text style={styles.eventName}>"{eventName}"</Text> and all associated data.
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onConfirm}>
            <Text style={styles.deleteText}>Delete Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  eventName: {
    fontWeight: '600',
    color: '#d33',
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  deleteButton: {
    backgroundColor: '#d33',
  },
  cancelText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  deleteText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
  },
});
