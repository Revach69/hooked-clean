import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event, EventProfile } from '@/api/entities';
import { Card } from '../components/Card';


export default function JoinScreen() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!code || typeof code !== 'string') {
      setError('Missing or invalid event code.');
      setIsLoading(false);
      return;
    }

    const processJoin = async () => {
      try {
        const events = await Event.filter({ code: code.toUpperCase() });
        if (events.length === 0) {
          setError('Invalid event code. Please try again.');
          setIsLoading(false);
          return;
        }

        const foundEvent = events[0];
        if (!foundEvent.starts_at || !foundEvent.expires_at) {
          setError('This event is not configured correctly. Please contact the organizer.');
          setIsLoading(false);
          return;
        }

        const now = new Date().toISOString();
        if (now < foundEvent.starts_at) {
          setError("This event hasn't started yet. Try again soon!");
          setIsLoading(false);
          return;
        }
        if (now >= foundEvent.expires_at) {
          setError('This event has ended.');
          setIsLoading(false);
          return;
        }

        await AsyncStorage.setItem('currentEventId', foundEvent.id);
        await AsyncStorage.setItem('currentEventCode', foundEvent.code);

        const existingSessionId = await AsyncStorage.getItem('currentSessionId');
        if (existingSessionId) {
          const existingProfiles = await EventProfile.filter({
            session_id: existingSessionId,
            event_id: foundEvent.id,
          });

          if (existingProfiles.length > 0) {
            router.replace('/Discovery');
            return;
          }
        }

        router.replace('/Consent');
      } catch (e) {
        console.error('Join error:', e);
        setError('Unable to process event access. Please try again.');
        setIsLoading(false);
      }
    };

    processJoin();
  }, [code]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Card>
          <ActivityIndicator size="large" color="#a855f7" style={styles.loader} />
          <Text style={styles.title}>Joining Event...</Text>
          <Text style={styles.subtitle}>Please wait while we verify your event access.</Text>
        </Card>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Card>
          <Text style={[styles.title, { color: '#dc2626' }]}>Unable to Join Event</Text>
          <Text style={styles.subtitle}>{error}</Text>
          <TouchableOpacity onPress={() => router.replace('/')} style={styles.button}>
            <Text style={styles.buttonText}>Return to Home</Text>
          </TouchableOpacity>
        </Card>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0ecff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loader: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
