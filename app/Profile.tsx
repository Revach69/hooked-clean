import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


// ✅ Add these imports for backend helpers
import { User, EventProfile } from '@/api/entities';
import { UserData, EventProfileData } from '@/types';
import { UploadFile } from '@/api/integrations'; // ✅ Correct



const ALL_INTERESTS = [
  'music', 'tech', 'food', 'books', 'travel', 'art', 'fitness', 'nature',
  'movies', 'business', 'photography', 'dancing', 'yoga', 'gaming', 'comedy',
  'startups', 'fashion', 'spirituality', 'volunteering', 'crypto', 'cocktails',
  'politics', 'hiking', 'design', 'podcasts', 'pets', 'wellness',
];

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [eventProfile, setEventProfile] = useState<EventProfileData | null>(null);
  const [formData, setFormData] = useState({ bio: '', interests: [], height: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const u = await User.me();
      setUser(u);
      setFormData({
        bio: u.bio || '',
        interests: u.interests || [],
        height: u.height || '',
      });
      const eventId = await AsyncStorage.getItem('currentEventId');
      const sessionId = await AsyncStorage.getItem('currentSessionId');
      const profiles = await EventProfile.filter({ event_id: eventId, session_id: sessionId });
      if (profiles.length > 0) setEventProfile(profiles[0]);
    } catch (e) {
      Alert.alert('Error', 'Failed to load profile.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, []);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled) {
      try {
        setIsUploading(true);
        const uri = result.assets[0].uri;
        const { file_url } = await UploadFile({ file: { uri } });
        await User.updateMyUserData({ profile_photo_url: file_url });
        await loadData();
      } catch (e) {
        Alert.alert('Upload Failed', 'Could not update profile photo.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickPhoto} style={styles.photoWrapper}>
        {user?.profile_photo_url ? (
          <Image source={{ uri: user.profile_photo_url }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, { backgroundColor: user?.profile_color || '#aaa' }]}>
            <Text style={styles.photoInitial}>{user?.full_name?.[0] || '?'}</Text>
          </View>
        )}
        <View style={styles.overlay}>
          <Ionicons name="camera" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      <Text style={styles.label}>Bio</Text>
      <Text style={styles.text}>{formData.bio}</Text>

      <Text style={styles.label}>Height</Text>
      <Text style={styles.text}>{formData.height || '-'}</Text>

      <Text style={styles.label}>Your Interests</Text>
      <View style={styles.interestsContainer}>
        {formData.interests.map((interest, idx) => (
          <View key={idx} style={styles.interestChip}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photoWrapper: { position: 'relative', marginBottom: 20 },
  photo: { width: 100, height: 100, borderRadius: 50 },
  photoInitial: { color: 'white', fontSize: 36, fontWeight: 'bold', textAlign: 'center', lineHeight: 100 },
  overlay: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 20
  },
  label: { fontWeight: '600', fontSize: 16, alignSelf: 'flex-start', marginTop: 10 },
  text: { fontSize: 14, color: '#444', alignSelf: 'flex-start', marginBottom: 10 },
  interestsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 10 },
  interestChip: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  interestText: { fontSize: 12, color: '#333' },
});
