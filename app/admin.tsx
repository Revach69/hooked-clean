import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { PlusCircle, Trash2, Pencil, Download } from 'lucide-react-native';
import { Event } from '@/api/entities';
import { EventData } from '@/types';
import Toast from 'react-native-toast-message';
import EventFormModal from '@/components/admin/EventFormModal';

export default function AdminScreen() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const allEvents = await Event.all();
      setEvents(allEvents.sort((a, b) => (b.starts_at ?? '').localeCompare(a.starts_at ?? '')));
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed to load events' });
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await Event.delete(id);
            Toast.show({ type: 'success', text1: 'Event deleted' });
            fetchEvents();
          } catch {
            Toast.show({ type: 'error', text1: 'Failed to delete event' });
          }
        },
      },
    ]);
  };

  const handleDownload = async (id: string) => {
    try {
      await Event.download(id); // You might need to adjust this for mobile (see note below)
      Toast.show({ type: 'success', text1: 'Event download started' });

    } catch {
      Toast.show({ type: 'error', text1: 'Failed to download event' });

    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <TouchableOpacity
        onPress={() => {
          setSelectedEvent(null);
          setShowFormModal(true);
        }}
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
              <TouchableOpacity
                onPress={() => {
                  setSelectedEvent(event);
                  setShowFormModal(true);
                }}
                style={styles.actionButton}
              >
                <Pencil size={16} />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(event.id)}
                style={styles.actionButton}
              >
                <Trash2 size={16} color="red" />
                <Text style={[styles.actionText, { color: 'red' }]}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDownload(event.id)}
                style={styles.actionButton}
              >
                <Download size={16} />
                <Text style={styles.actionText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {showFormModal && (
        <EventFormModal
          event={selectedEvent}
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          onSuccess={() => {
            setShowFormModal(false);
            fetchEvents();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
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
