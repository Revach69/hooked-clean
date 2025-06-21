import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';

type Props = {
  visible: boolean;
  profile: any;
  onClose: () => void;
};

export default function ProfileDetailModal({ visible, profile, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.card}>
          <Image source={{ uri: profile?.profile_photo_url }} style={styles.image} />
          <Text style={styles.name}>{profile?.first_name}</Text>
          <Text style={styles.bio}>{profile?.bio}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 20, width: 300, alignItems: 'center' },
  image: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: '600' },
  bio: { fontSize: 14, color: '#444', marginVertical: 10, textAlign: 'center' },
  close: { color: '#6366f1', fontWeight: '500' },
});
