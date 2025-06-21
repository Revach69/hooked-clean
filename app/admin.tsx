import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { PlusCircle, Trash2, Pencil, Download, BarChart2, MessageSquare } from 'lucide-react-native';
import { Event, EventProfile, Like, Message, EventFeedback } from '@/api/entities';
import { EventData } from '@/types';
import Toast from 'react-native-toast-message';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import EventFormModal from '@/components/admin/EventFormModal';
import EventAnalyticsModal from '@/components/admin/EventAnalyticsModal';
import FeedbackInsightsModal from '@/components/admin/FeedbackInsightsModal';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

const ADMIN_PASSCODE = 'HOOKEDADMIN24';

export default function AdminScreen() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [modals, setModals] = useState({ form: false, analytics: false, feedbacks: false, delete: false });

  const fetchEvents = useCallback(async () => {
    try {
      const allEvents = await Event.all();
      setEvents(allEvents.sort((a, b) => (b.starts_at ?? '').localeCompare(a.starts_at ?? '')));
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to load events' });
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchEvents();
  }, [fetchEvents, authenticated]);

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      await Event.delete(selectedEvent.id);
      Toast.show({ type: 'success', text1: 'Event deleted' });
      setModals({ form: false, analytics: false, feedbacks: false, delete: false });
      fetchEvents();
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to delete event' });
    }
  };

  const handleDownload = async (event: EventData) => {
    try {
      const [profiles, likes, messages] = await Promise.all([
        EventProfile.filter({ event_id: event.id }),
        Like.filter({ event_id: event.id }),
        Message.filter({ event_id: event.id }),
      ]);
      const data = { profiles, likes, messages };
      const path = FileSystem.cacheDirectory + `${event.code}_export.json`;
      await FileSystem.writeAsStringAsync(path, JSON.stringify(data, null, 2));
      await Sharing.shareAsync(path);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to export event' });
    }
  };

  const openModal = (name: keyof typeof modals, event?: EventData) => {
    if (event) setSelectedEvent(event); else setSelectedEvent(null);
    setModals((prev) => ({ ...prev, [name]: true }));
  };

  const closeModals = () => {
    setModals({ form: false, analytics: false, feedbacks: false, delete: false });
    setSelectedEvent(null);
  };

  const handleAuthenticate = () => {
    if (password === ADMIN_PASSCODE) {
      setAuthenticated(true);
      Toast.show({ type: 'success', text1: 'Authentication successful' });
    } else {
      Toast.show({ type: 'error', text1: 'Incorrect passcode' });
    }
  };

  if (!authenticated) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.title}>Admin Access</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter Passcode"
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity onPress={handleAuthenticate} style={styles.authButton}>
          <Text style={{ color: 'white' }}>Authenticate</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <TouchableOpacity
        onPress={() => openModal('form')}
        style={styles.createButton}
      >
        <PlusCircle size={18} color="#fff" />
        <Text style={styles.createButtonText}>Create Event</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scroll}>
        {events.map((event) => (
          <View key={event.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{event.name}</Text>
              <Text style={styles.cardDate}>{new Date(event.starts_at).toLocaleString()}</Text>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => openModal('form', event)} style={styles.actionButton}>
                <Pencil size={16} />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openModal('delete', event)} style={styles.actionButton}>
                <Trash2 size={16} color="red" />
                <Text style={[styles.actionText, { color: 'red' }]}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDownload(event)} style={styles.actionButton}>
                <Download size={16} />
                <Text style={styles.actionText}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openModal('analytics', event)} style={styles.actionButton}>
                <BarChart2 size={16} />
                <Text style={styles.actionText}>Analytics</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openModal('feedbacks', event)} style={styles.actionButton}>
                <MessageSquare size={16} />
                <Text style={styles.actionText}>Feedbacks</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {modals.form && (
        <EventFormModal
          event={selectedEvent}
          isOpen={true}
          onClose={closeModals}
          onSuccess={() => {
            closeModals();
            fetchEvents();
          }}
        />
      )}

      {modals.analytics && selectedEvent && (
        <EventAnalyticsModal event={selectedEvent} isOpen={true} onClose={closeModals} />
      )}

      {modals.feedbacks && selectedEvent && (
        <FeedbackInsightsModal event={selectedEvent} isOpen={true} onClose={closeModals} />
      )}

      {modals.delete && selectedEvent && (
        <DeleteConfirmationDialog
          isVisible={true}
          eventName={selectedEvent.name}
          onConfirm={handleDeleteEvent}
          onCancel={closeModals}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  authContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, width: '80%', marginVertical: 12 },
  authButton: { backgroundColor: '#6366f1', padding: 12, borderRadius: 8 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  scroll: { marginTop: 10 },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: { marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardDate: { fontSize: 12, color: '#555' },
  cardActions: { flexDirection: 'row', marginTop: 12, gap: 16 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 14 },
});
