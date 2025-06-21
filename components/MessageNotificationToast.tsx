import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  senderName: string;
  onDismiss: () => void;
  onView: () => void;
};

export default function MessageNotificationToast({ senderName, onDismiss, onView }: Props) {
  return (
    <View style={styles.toast}>
      <Text style={styles.title}>💬 New message from {senderName}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={onDismiss}>
          <Text style={styles.link}>Dismiss</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onView}>
          <Text style={styles.link}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
  },
  link: {
    color: '#6366f1',
    fontWeight: '500',
  },
});
