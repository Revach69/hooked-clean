import { Event } from '@/api/entities';
import { format } from 'date-fns';
import { Loader2, Save, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function EventFormModal({ event, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    location: '',
    description: '',
    organizer_email: '',
    starts_at: '',
    expires_at: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setFormData({
          name: event.name || '',
          code: (event.code || '').toUpperCase(),
          location: event.location || '',
          description: event.description || '',
          organizer_email: event.organizer_email || '',
          starts_at: event.starts_at ? format(new Date(event.starts_at), "yyyy-MM-dd'T'HH:mm") : '',
          expires_at: event.expires_at ? format(new Date(event.expires_at), "yyyy-MM-dd'T'HH:mm") : '',
        });
      } else {
        setFormData({
          name: '', code: '', location: '', description: '', organizer_email: '',
          starts_at: '', expires_at: '',
        });
      }
      setFormErrors({});
    }
  }, [event, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    const processed = field === 'code' ? value.toUpperCase() : value;
    setFormData((prev) => ({ ...prev, [field]: processed }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.starts_at) errors.starts_at = "Start date required";
    if (!formData.expires_at) errors.expires_at = "End date required";
    if (formData.starts_at && formData.expires_at) {
      if (new Date(formData.expires_at) <= new Date(formData.starts_at)) {
        errors.expires_at = "End date must be after start";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({ type: 'error', text1: "Please fix form errors." });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        starts_at: new Date(formData.starts_at).toISOString(),
        expires_at: new Date(formData.expires_at).toISOString(),
      };

      if (event) {
        await Event.update(event.id, payload);
        Toast.show({ type: 'success', text1: `Event "${payload.name}" updated` });
      } else {
        await Event.create(payload);
        Toast.show({ type: 'success', text1: `Event "${payload.name}" created` });
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      Toast.show({ type: 'error', text1: "Failed to save event." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{event ? 'Edit Event' : 'Create Event'}</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={20} />
          </TouchableOpacity>
        </View>

        {['name', 'code', 'starts_at', 'expires_at', 'location', 'description', 'organizer_email'].map((field) => (
          <View key={field} style={styles.inputGroup}>
            <Text style={styles.label}>{field.replace('_', ' ').toUpperCase()}</Text>
            <TextInput
              value={formData[field]}
              onChangeText={(val) => handleInputChange(field, val)}
              placeholder={`Enter ${field}`}
              style={[styles.input, formErrors[field] && styles.inputError]}
            />
            {formErrors[field] && <Text style={styles.errorText}>{formErrors[field]}</Text>}
          </View>
        ))}

        <View style={styles.actions}>
          <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancel]}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={[styles.button, styles.submit]}>
            {isSubmitting ? <Loader2 size={16} /> : <Save size={16} />}
            <Text style={{ marginLeft: 6 }}>{event ? 'Save' : 'Create'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  container: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  inputGroup: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancel: {
    backgroundColor: '#eee',
  },
  submit: {
    backgroundColor: '#007bff',
  },
});
// This code defines a React Native component for creating or editing an event.
// It includes a form with fields for event details, validation, and submission handling.
// The form can be opened as a modal, and it uses the `Event` API entity for data operations.
// The component also integrates with `react-native-toast-message` for user feedback.
// It handles both creating new events and editing existing ones, with appropriate validation and error handling.
// The styles are defined using `StyleSheet.create` for better performance and organization.
// The component is designed to be reusable and can be easily integrated into an admin panel or event management system.