import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { EventFeedback } from '@/api/entities';

type Props = {
  event: any;
  isOpen: boolean;
  onClose: () => void;
};

export default function FeedbackInsightsModal({ event, isOpen, onClose }: Props) {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && event) loadFeedbacks();
  }, [isOpen, event]);

  const loadFeedbacks = async () => {
    setIsLoading(true);
    try {
      const list = await EventFeedback.filter({ event_id: event.id });
      setFeedbacks(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Feedback Insights</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#888" />
        ) : feedbacks.length === 0 ? (
          <Text style={styles.noFeedback}>No feedback yet.</Text>
        ) : (
          <ScrollView contentContainerStyle={styles.feedbackList}>
            {feedbacks.map((f, i) => (
              <View key={i} style={styles.feedbackCard}>
                <Text style={styles.cardTitle}>#{i + 1}</Text>
                <Text style={styles.cardText}><Text style={styles.bold}>General:</Text> {f.general_feedback}</Text>
                <Text style={styles.cardText}><Text style={styles.bold}>Rating:</Text> {f.rating_profile_setup}/5</Text>
              </View>
            ))}
          </ScrollView>
        )}
        <Text style={styles.closeBtn} onPress={onClose}>Close</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  noFeedback: { textAlign: 'center', fontSize: 16, color: '#777' },
  feedbackList: { gap: 12 },
  feedbackCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  cardText: { fontSize: 14, color: '#333' },
  bold: { fontWeight: '600' },
  closeBtn: { marginTop: 20, textAlign: 'center', color: 'blue' }
});
