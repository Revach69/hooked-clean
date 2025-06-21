import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Event, EventProfile, Like } from '@/api/entities';
import FirstTimeGuideModal from '@/components/FirstTimeGuideModal';
import ProfileDetailModal from '@/components/ProfileDetailModal';

interface Profile {
  id: string;
  session_id: string;
  first_name: string;
  age: number;
  interests?: string[];
  profile_photo_url?: string | null;
  profile_color?: string | null;
}

export default function DiscoveryScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventId, setEventId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!eventId || !sessionId) return;
    try {
      const [allProfiles, likes] = await Promise.all([
        EventProfile.filter({ event_id: eventId, is_visible: true }),
        Like.filter({ liker_session_id: sessionId, event_id: eventId }),
      ]);
      const me = allProfiles.find(p => p.session_id === sessionId);
      setProfiles(allProfiles.filter(p => p.session_id !== sessionId));
      setLiked(new Set(likes.map(l => l.liked_session_id)));
      if (!me) {
        router.replace('/');
      }
    } catch (e) {
      console.warn('load profiles', e);
    }
    setIsLoading(false);
  }, [eventId, sessionId, router]);

  const initialize = useCallback(async () => {
    const eid = await AsyncStorage.getItem('currentEventId');
    const sid = await AsyncStorage.getItem('currentSessionId');
    if (!eid || !sid) {
      router.replace('/');
      return;
    }
    setEventId(eid);
    setSessionId(sid);

    const hasSeen = await AsyncStorage.getItem(`hasSeenGuide_${eid}`);
    if (!hasSeen) setShowGuide(true);

    const events = await Event.filter({ id: eid });
    const now = new Date().toISOString();
    if (!events.length || !events[0].starts_at || !events[0].expires_at || now < events[0].starts_at || now > events[0].expires_at) {
      await AsyncStorage.multiRemove(['currentEventId','currentSessionId','currentEventCode']);
      router.replace('/');
      return;
    }
  }, [router]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      if (AppState.currentState === 'active') loadData();
    }, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleLike = async (profile: Profile) => {
    if (!sessionId || !eventId || liked.has(profile.session_id)) return;
    setLiked(prev => new Set([...prev, profile.session_id]));
    try {
      const newLike = await Like.create({
        event_id: eventId,
        liker_session_id: sessionId,
        liked_session_id: profile.session_id,
        is_mutual: false,
        liker_notified_of_match: false,
        liked_notified_of_match: false,
      });
      const reciprocal = await Like.filter({ event_id: eventId, liker_session_id: profile.session_id, liked_session_id: sessionId });
      if (reciprocal.length) {
        await Like.update(newLike.id, { is_mutual: true, liker_notified_of_match: true });
        await Like.update(reciprocal[0].id, { is_mutual: true, liked_notified_of_match: true });
        Alert.alert("It's a match!", `You and ${profile.first_name} like each other.`);
      }
    } catch (e) {
      console.error('like error', e);
      setLiked(prev => { const s = new Set(prev); s.delete(profile.session_id); return s; });
    }
  };

  const handleCloseGuide = async () => {
    if (eventId) await AsyncStorage.setItem(`hasSeenGuide_${eventId}`, 'true');
    setShowGuide(false);
  };

  const renderProfile = ({ item }: { item: Profile }) => (
    <TouchableOpacity style={styles.card} onPress={() => setCurrentProfile(item)}>
      {item.profile_photo_url ? (
        <Image source={{ uri: item.profile_photo_url }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, { backgroundColor: item.profile_color || '#ccc', justifyContent:'center', alignItems:'center' }] }>
          <Text style={{ color: '#fff', fontSize: 24 }}>{item.first_name[0]}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.first_name}, {item.age}</Text>
        {item.interests && (
          <Text style={styles.interests}>{item.interests.slice(0,2).join(', ')}{item.interests.length>2?` +${item.interests.length-2}`:''}</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => handleLike(item)} disabled={liked.has(item.session_id)} style={styles.likeBtn}>
        <Text style={{color:'#fff'}}>{liked.has(item.session_id)?'Liked':'Like'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Singles</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#ff6b6b" />
      ) : (
        <FlatList data={profiles} keyExtractor={(item) => item.session_id} renderItem={renderProfile} contentContainerStyle={styles.list} />
      )}
      {showGuide && <FirstTimeGuideModal onClose={handleCloseGuide} />}
      {currentProfile && (
        <ProfileDetailModal visible profile={currentProfile} onClose={() => setCurrentProfile(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { flexDirection:'row', alignItems:'center', padding:16, borderRadius:12, backgroundColor:'#f3f4f6', marginBottom:12 },
  photo: { width:64, height:64, borderRadius:32 },
  info: { flex:1, marginLeft:10 },
  name: { fontSize:18, fontWeight:'600' },
  interests: { color:'#555' },
  likeBtn: { backgroundColor:'#6366f1', paddingVertical:6, paddingHorizontal:12, borderRadius:20 },
});
