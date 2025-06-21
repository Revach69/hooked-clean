// app/Consent.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

import { UploadFile } from '@/api/integrations';
import { Event, EventProfile, User } from '../api/entities';

const COLORS = [
  "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57",
  "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43"
];

export default function ConsentScreen() {
  const router = useRouter();
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<any>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    age: '',
    gender_identity: '',
    interested_in: '',
    consent: false,
  });

  useEffect(() => {
    (async () => {
      const eventId = await AsyncStorage.getItem('currentEventId');
      if (!eventId) return router.push('/home');
      const events = await Event.filter({ id: eventId });
      if (!events.length) return router.push('/home');
      setCurrentEvent(events[0]);

      try {
        const currentUser = await User.me().catch(() => null);
        if (currentUser) {
          setFormData((prev) => ({
            ...prev,
            first_name: currentUser.full_name || '',
            age: currentUser.age?.toString() || '',
            gender_identity: currentUser.gender_identity || '',
            interested_in: currentUser.interested_in || '',
          }));
          if (currentUser.profile_photo_url) {
            setProfilePhotoPreview(currentUser.profile_photo_url);
          }
        }
      } catch (err) {
        console.warn('Error loading user:', err);
      }

      setIsLoading(false);
    })();
  }, []);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Toast.show({ type: 'error', text1: 'Permission denied to access photos.' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, base64: false });
    if (!result.canceled && result.assets.length > 0) {
      setProfilePhoto(result.assets[0]);
      setProfilePhotoPreview(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!profilePhotoPreview || !formData.first_name || !formData.age || !formData.gender_identity || !formData.interested_in || !formData.consent) {
      Toast.show({ type: 'error', text1: 'Please fill out all fields and accept consent.' });
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedPhotoUrl = profilePhotoPreview;

      if (profilePhoto && profilePhoto.uri && profilePhoto.uri.startsWith('file://')) {
        const fileUri = profilePhoto.uri;
        const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: 'base64' });
        const blob = `data:image/jpeg;base64,${base64}`;
        const { file_url } = await UploadFile({ file: blob });
        uploadedPhotoUrl = file_url;
      }

      const profileColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await User.updateMyUserData({
        full_name: formData.first_name,
        age: parseInt(formData.age),
        gender_identity: formData.gender_identity,
        interested_in: formData.interested_in,
        profile_photo_url: uploadedPhotoUrl,
        profile_color: profileColor,
      });

      await EventProfile.create({
        event_id: currentEvent.id,
        session_id: sessionId,
        profile_photo_url: uploadedPhotoUrl,
        first_name: formData.first_name,
        age: parseInt(formData.age),
        gender_identity: formData.gender_identity,
        interested_in: formData.interested_in,
        profile_color: profileColor,
      });

      await AsyncStorage.setItem('currentSessionId', sessionId);
      await AsyncStorage.setItem('currentProfileColor', profileColor);
      if (uploadedPhotoUrl) await AsyncStorage.setItem('currentProfilePhotoUrl', uploadedPhotoUrl);

      Toast.show({ type: 'success', text1: 'Profile saved! Redirecting...' });
      router.push('/Discovery');
    } catch (error) {
      console.error('Submit error:', error);
      Toast.show({ type: 'error', text1: 'Failed to create profile. Try again.' });
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Event Profile</Text>
      <TouchableOpacity onPress={handlePickImage} style={styles.upload}>
        <Text style={styles.uploadText}>{profilePhotoPreview ? 'Change Photo' : 'Upload Profile Photo'}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.first_name}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, first_name: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={formData.age}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, age: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Gender Identity"
        value={formData.gender_identity}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, gender_identity: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Interested In"
        value={formData.interested_in}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, interested_in: text }))}
      />

      <TouchableOpacity
        style={[styles.checkbox, formData.consent && styles.checkboxChecked]}
        onPress={() => setFormData((prev) => ({ ...prev, consent: !prev.consent }))}
      >
        <Text style={{ color: formData.consent ? '#fff' : '#333' }}>
          I agree to appear to other singles at this event
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>
            Join the Singles List <ArrowRight size={16} color="#fff" />
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  upload: {
    backgroundColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  uploadText: {
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  checkbox: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#333',
  },
  submitButton: {
    backgroundColor: '#ff6b6b',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
