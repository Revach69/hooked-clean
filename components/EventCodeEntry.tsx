import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';

interface EventCodeEntryProps {
  onSubmit: (code: string) => void;
}

const EventCodeEntry: React.FC<EventCodeEntryProps> = ({ onSubmit }) => {
  const [code, setCode] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Event Code</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="1234"
      />
      <Button title="Join Event" onPress={() => onSubmit(code)} />
    </View>
  );
};

export default EventCodeEntry;

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});
