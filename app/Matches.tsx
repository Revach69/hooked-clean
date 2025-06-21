import { EventProfile, Like, Message } from '@/api/entities';
import ChatModal from '@/components/ChatModal';
import { getCurrentEventId, getCurrentSessionId } from '@/utils/session';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, AppState, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MatchesScreen = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [sid, eid] = await Promise.all([
        getCurrentSessionId(),
        getCurrentEventId(),
      ]);
      setCurrentSessionId(sid);
      setCurrentEventId(eid);
    })();
  }, []);

  const markMatchesAsNotified = useCallback(async (profiles: any[]) => {
    if (!currentSessionId || !currentEventId) return;
    const allMutualLikes = await Like.filter({ event_id: currentEventId, is_mutual: true });

    for (const profile of profiles) {
      const myLike = allMutualLikes.find(l => l.liker_session_id === currentSessionId && l.liked_session_id === profile.session_id);
      const theirLike = allMutualLikes.find(l => l.liker_session_id === profile.session_id && l.liked_session_id === currentSessionId);

      if (myLike && !myLike.liker_notified_of_match) {
        await Like.update(myLike.id, { liker_notified_of_match: true });
      }
      if (theirLike && !theirLike.liked_notified_of_match) {
        await Like.update(theirLike.id, { liked_notified_of_match: true });
      }
    }
  }, [currentSessionId, currentEventId]);

  const loadMatches = useCallback(async () => {
    if (!currentSessionId || !currentEventId) return;
    setIsLoading(true);

    try {
      const myLikes = await Like.filter({ liker_session_id: currentSessionId, event_id: currentEventId, is_mutual: true });
      const likesToMe = await Like.filter({ liked_session_id: currentSessionId, event_id: currentEventId, is_mutual: true });

      const matchedIds = new Set([
        ...myLikes.map(l => l.liked_session_id),
        ...likesToMe.map(l => l.liker_session_id),
      ]);

      if (matchedIds.size === 0) {
        setMatches([]);
        setIsLoading(false);
        return;
      }

      const profiles = await EventProfile.filter({
        session_id: Array.from(matchedIds),
        event_id: currentEventId
      });

      const matchesWithUnread = await Promise.all(profiles.map(async (profile) => {
        const ids = [currentSessionId, profile.session_id].sort();
        const matchId = `${ids[0]}_${ids[1]}`;
        const unread = await Message.filter({
          match_id: matchId,
          receiver_session_id: currentSessionId,
          is_read: false,
          event_id: currentEventId
        });
        return { ...profile, unreadCount: unread.length };
      }));

      setMatches(matchesWithUnread);
      markMatchesAsNotified(profiles);
    } catch (err) {
      console.error("Match loading error:", err);
    }

    setIsLoading(false);
  }, [currentSessionId, currentEventId, markMatchesAsNotified]);

  useFocusEffect(
    useCallback(() => {
      if (!currentSessionId || !currentEventId) return () => {};
      loadMatches();
      const interval = setInterval(() => {
        if (AppState.currentState === 'active') {
          loadMatches();
        }
      }, 45000);
      return () => clearInterval(interval);
    }, [loadMatches, currentSessionId, currentEventId])
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => {
      setSelectedMatch(item);
      setIsChatVisible(true);
    }}>
      <Image
        source={{ uri: item.profile_photo_url }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.first_name}, {item.age}</Text>
        <Text style={styles.interests}>{item.interests?.slice(0, 2).join(', ')}</Text>
        {item.unreadCount > 0 && (
          <Text style={styles.unread}>{item.unreadCount} unread</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Matches</Text>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.session_id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      {isChatVisible && selectedMatch && (
        <ChatModal
          match={selectedMatch}
          onClose={() => {
            setIsChatVisible(false);
            setSelectedMatch(null);
            loadMatches();
          }}
        />
      )}
    </View>
  );
};

export default MatchesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  list: { paddingBottom: 100 },
  card: { flexDirection: 'row', padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  info: { marginLeft: 10, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: 'bold' },
  interests: { color: '#555' },
  unread: { color: 'red', fontWeight: 'bold' }
});
