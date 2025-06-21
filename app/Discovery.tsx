import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Profile = {
  id: string;
  first_name: string;
  age: number;
  interests: string[];
};

export default function DiscoveryScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMockProfiles = async () => {
    const mockProfiles = [
      {
        id: '1',
        first_name: 'Alice',
        age: 28,
        interests: ['Yoga', 'Art'],
      },
      {
        id: '2',
        first_name: 'Ben',
        age: 32,
        interests: ['Hiking', 'Cooking', 'Tech'],
      },
    ];
    setProfiles(mockProfiles);
    setIsLoading(false);
  };

  const checkSession = async () => {
    const sessionId = await AsyncStorage.getItem('currentSessionId');
    const eventId = await AsyncStorage.getItem('currentEventId');
    if (!sessionId || !eventId) {
      router.replace('/');
    } else {
      await loadMockProfiles();
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const renderProfile = ({ item }: { item: Profile }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        // placeholder for opening profile modal
        alert(`${item.first_name}'s profile`);
      }}
    >
      <Text style={styles.name}>{item.first_name}, {item.age}</Text>
      <Text style={styles.interests}>
        {item.interests.slice(0, 2).join(', ')}
        {item.interests.length > 2 && ` +${item.interests.length - 2}`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Singles</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#ff6b6b" />
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id}
          renderItem={renderProfile}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: '#fff' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  interests: {
    marginTop: 8,
    color: '#555',
  },
});
