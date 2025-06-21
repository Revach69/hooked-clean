import React, { useEffect } from 'react';
import { X } from 'lucide-react-native';
import { View, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const GUIDE_IMAGE_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/9f8621f07_HOOKED-tips.png';

interface Props {
  onClose: () => void;
}

export default function FirstTimeGuideModal({ onClose }: Props) {
  useEffect(() => {
    // Disable scroll
    return () => {
      // Enable scroll
    };
  }, []);

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image source={{ uri: GUIDE_IMAGE_URL }} style={styles.image} resizeMode="contain" />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  container: { position: 'relative', width: '90%', aspectRatio: 1, backgroundColor: 'transparent', borderRadius: 12 },
  image: { width: '100%', height: '100%', borderRadius: 12 },
  closeBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#00000088', borderRadius: 20, padding: 4 },
});
