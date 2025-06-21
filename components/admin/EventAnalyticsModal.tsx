import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { EventProfile, Like, Message } from '@/api/entities';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  event: any;
  isOpen: boolean;
  onClose: () => void;
};

export default function EventAnalyticsModal({ event, isOpen, onClose }: Props) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && event) loadAnalytics();
  }, [isOpen, event]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [profiles, likes, messages] = await Promise.all([
        EventProfile.filter({ event_id: event.id }),
        Like.filter({ event_id: event.id }),
        Message.filter({ event_id: event.id }),
      ]);
      setStats({
        profiles: profiles.length,
        likes: likes.length,
        messages: messages.length,
        mutualMatches: likes.filter((l) => l.is_mutual).length / 2,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Event Analytics</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#888" />
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <Stat label="Profiles" icon="people" value={stats.profiles} />
            <Stat label="Likes" icon="heart" value={stats.likes} />
            <Stat label="Mutual Matches" icon="heart-circle" value={stats.mutualMatches} />
            <Stat label="Messages" icon="chatbubble-ellipses" value={stats.messages} />
          </ScrollView>
        )}
        <Text style={styles.closeBtn} onPress={onClose}>Close</Text>
      </View>
    </Modal>
  );
}

function Stat({ label, icon, value }: { label: string; icon: any; value: number }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={24} color="#555" />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  content: { gap: 16 },
  stat: { alignItems: 'center', padding: 12 },
  statLabel: { fontSize: 16, marginTop: 4 },
  statValue: { fontSize: 22, fontWeight: '600', marginTop: 2 },
  closeBtn: { marginTop: 24, textAlign: 'center', color: 'blue' }
});
