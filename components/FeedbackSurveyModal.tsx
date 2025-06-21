import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Event, EventFeedback } from '@/api/entities';

interface FeedbackSurveyModalProps {
  event: typeof Event;
  sessionId: string;
  onClose: () => void;
}

export default function FeedbackSurveyModal({ event, sessionId, onClose }: FeedbackSurveyModalProps) {
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Feedback Required', 'Please enter your feedback before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      await EventFeedback.create({
        event_id: event.id,
        session_id: sessionId,
        text: feedbackText,
      });

      localStorage.setItem(`feedback_given_for_${event.id}`, 'true');
      Alert.alert('Thank you!', 'Your feedback has been submitted.');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>We’d love your feedback!</Text>
          <Text style={styles.label}>What did you think of this Hooked event?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your feedback here..."
            value={feedbackText}
            onChangeText={setFeedbackText}
            multiline
          />
          <View style={styles.buttons}>
            <TouchableOpacity onPress={onClose} style={styles.cancel}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submit} disabled={isSubmitting}>
              <Text style={{ color: 'white' }}>{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000099' },
  modal: { backgroundColor: 'white', padding: 20, borderRadius: 12, width: '90%' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  label: { fontSize: 14, color: '#444', marginBottom: 8 },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 100, textAlignVertical: 'top' },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  cancel: { padding: 10 },
  submit: { backgroundColor: '#6366f1', padding: 10, borderRadius: 8 },
});
