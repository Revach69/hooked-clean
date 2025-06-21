// app/LayoutScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Like, Event, EventProfile, Message } from '@/api/entities';
import { EventData } from '@/types';
import MatchNotificationToast from '@/components/MatchNotificationToast';
import MessageNotificationToast from '@/components/MessageNotificationToast';
import FeedbackSurveyModal from '@/components/FeedbackSurveyModal';

export default function LayoutScreen() {
  const router = useRouter();
  const [hasUnseenMatches, setHasUnseenMatches] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [showMatchToast, setShowMatchToast] = useState(false);
  const [newMatchDetails, setNewMatchDetails] = useState({ name: '', profileId: '' });
  const [showMessageToast, setShowMessageToast] = useState(false);
  const [newMessageDetails, setNewMessageDetails] = useState({ name: '' });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackEvent, setFeedbackEvent] = useState<EventData | null>(null);
  const [feedbackSessionId, setFeedbackSessionId] = useState<string | null>(null);

  const checkFeedbackEligibility = useCallback(async () => {
    const lastEventId = await AsyncStorage.getItem('currentEventId');
    const lastSessionId = await AsyncStorage.getItem('currentSessionId');
    if (!lastEventId || !lastSessionId) return;
    const feedbackGiven = await AsyncStorage.getItem(`feedback_given_for_${lastEventId}`);
    if (feedbackGiven) return;

    const events = await Event.filter({ id: lastEventId });
    if (events.length > 0 && events[0].expires_at < new Date().toISOString()) {
      setFeedbackEvent(events[0]);
      setFeedbackSessionId(lastSessionId);
      setShowFeedbackModal(true);
    }
  }, []);

  const checkNotifications = useCallback(async () => {
    const eventId = await AsyncStorage.getItem('currentEventId');
    const sessionId = await AsyncStorage.getItem('currentSessionId');
    if (!eventId || !sessionId) return;

    const matches = await Like.filter({ event_id: eventId, is_mutual: true });
    const unseenMatch = matches.find(
      (like) =>
        (like.liker_session_id === sessionId && !like.liker_notified_of_match) ||
        (like.liked_session_id === sessionId && !like.liked_notified_of_match)
    );

    if (unseenMatch) {
      const profile = await EventProfile.filter({
        session_id:
          unseenMatch.liker_session_id === sessionId
            ? unseenMatch.liked_session_id
            : unseenMatch.liker_session_id,
        event_id: eventId,
      });
      if (profile[0]) {
        setNewMatchDetails({ name: profile[0].first_name, profileId: profile[0].id });
        setShowMatchToast(true);
      }
    }
    setHasUnseenMatches(!!unseenMatch);

    const unreadMessages = await Message.filter({
      receiver_session_id: sessionId,
      event_id: eventId,
      is_read: false,
    });
    if (unreadMessages.length > 0) {
      const latest = unreadMessages[0];
      const senderProfile = await EventProfile.filter({ session_id: latest.sender_session_id, event_id: eventId });
      if (senderProfile[0]) {
        setNewMessageDetails({ name: senderProfile[0].first_name });
        setShowMessageToast(true);
      }
    }
    setHasUnreadMessages(unreadMessages.length > 0);
  }, []);

  useEffect(() => {
    checkNotifications();
    checkFeedbackEligibility();
  }, []);

  const handleLogoPress = () => {
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoButton} onPress={handleLogoPress}>
          <Ionicons name="heart" size={24} color="white" />
          <Text style={styles.logoText}>Hooked</Text>
        </TouchableOpacity>

        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navIcon} onPress={() => router.push('/Profile')}>
            <Ionicons name="person" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navIcon} onPress={() => router.push('/Matches')}>
            <Ionicons name="people" size={24} color="white" />
            {(hasUnseenMatches || hasUnreadMessages) && <View style={styles.dot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.contentText}>Layout loaded for mobile 🚀</Text>
      </View>

      {/* Instagram */}
      <TouchableOpacity
        style={styles.igButton}
        onPress={() => Linking.openURL('https://instagram.com/joinhooked')}
      >
        <Text style={styles.igText}>Follow us on IG @joinhooked</Text>
      </TouchableOpacity>

      {/* Toasts & Modal */}
      {showMatchToast && (
        <MatchNotificationToast
          matchName={newMatchDetails.name}
          onDismiss={() => setShowMatchToast(false)}
          onSeeMatches={() => {
            setShowMatchToast(false);
            router.push('/Matches');
          }}
        />
      )}

      {showMessageToast && (
        <MessageNotificationToast
          senderName={newMessageDetails.name}
          onDismiss={() => setShowMessageToast(false)}
          onView={() => {
            setShowMessageToast(false);
            router.push('/Matches');
          }}
        />
      )}

      {showFeedbackModal && feedbackEvent && feedbackSessionId && (
        <FeedbackSurveyModal
          event={feedbackEvent}
          sessionId={feedbackSessionId}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#ff6b6b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoButton: { flexDirection: 'row', alignItems: 'center' },
  logoText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 18,
  },
  navButtons: { flexDirection: 'row', gap: 16 },
  navIcon: { position: 'relative', padding: 8 },
  dot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  contentText: { fontSize: 18, fontWeight: '500' },
  igButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  igText: { color: '#999' },
});
