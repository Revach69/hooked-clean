import React, { useEffect } from 'react';
import { Modal, View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

interface Props {
  profile: {
    profile_photo_url?: string;
    profile_color?: string;
    first_name?: string;
  } | null;
  onClose: () => void;
}

export default function ImagePreviewModal({ profile, onClose }: Props) {
  useEffect(() => {
    return () => {};
  }, [onClose]);

  if (!profile) return null;
  const { profile_photo_url, profile_color, first_name } = profile;
  const initial = first_name?.[0]?.toUpperCase() || '?';

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {profile_photo_url ? (
            <Image source={{ uri: profile_photo_url }} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: profile_color || '#ccc' }]}>
              <Text style={styles.initial}>{initial}</Text>
            </View>
          )}
          <TouchableOpacity onPress={onClose} style={styles.close}>
            <X size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000cc' },
  modal: { width: '90%', aspectRatio: 1, position: 'relative' },
  image: { width: '100%', height: '100%', borderRadius: 12 },
  avatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  initial: { fontSize: 64, fontWeight: 'bold', color: 'white' },
  close: { position: 'absolute', top: 10, right: 10, backgroundColor: '#00000088', borderRadius: 20, padding: 6 },
});
