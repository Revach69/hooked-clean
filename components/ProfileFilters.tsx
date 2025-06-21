import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ProfileFilters({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.panel}>
          <Text style={styles.title}>Filter Preferences</Text>
          {/* TODO: Add your filters here */}
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.done}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center' },
  panel: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: 300 },
  title: { fontWeight: '600', fontSize: 18, marginBottom: 10 },
  done: { color: '#6366f1', textAlign: 'right', marginTop: 20 },
});
