import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import EventCodeEntry from '../components/EventCodeEntry';


export default function HomeScreen() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<null | 'qr' | 'manualCodeEntry'>(null);
  const [enteredCode, setEnteredCode] = useState('');

  useEffect(() => {
    checkActiveEventSession();
  }, []);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  
  // Ask for camera permission
  useEffect(() => {
    if (activeModal === 'qr') {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  }, [activeModal]);
  
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    handleEventAccess(data);
  };
  
  const checkActiveEventSession = async () => {
    const eventId = await AsyncStorage.getItem('currentEventId');
    const sessionId = await AsyncStorage.getItem('currentSessionId');

    if (!eventId || !sessionId) return;

    try {
      // Fake check: in production, replace with real fetch logic
      const nowISO = new Date().toISOString();
      const isActive = true; // Simulate the event being active

      if (isActive) {
        router.replace('/Discovery');
        return;
      }

      await clearEventStorage();
    } catch (err) {
      await clearEventStorage();
    }
  };

  const clearEventStorage = async () => {
    await AsyncStorage.multiRemove([
      'currentEventId',
      'currentSessionId',
      'currentEventCode',
      'currentProfileColor',
      'currentProfilePhotoUrl',
    ]);
  };

  const handleEventAccess = (code: string) => {
    closeModal();
    router.push(`/join?code=${code.toUpperCase()}`);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Hooked 🎉</Text>

      <TouchableOpacity style={styles.button} onPress={() => setActiveModal('qr')}>
        <Ionicons name="qr-code-outline" size={24} color="#fff" />
        <Text style={styles.buttonText}>Scan QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setActiveModal('manualCodeEntry')}>
        <Ionicons name="key-outline" size={24} color="#fff" />
        <Text style={styles.buttonText}>Enter Event Code</Text>
      </TouchableOpacity>

      {/* Dummy Modal for QR */}
      
{activeModal === 'qr' && (
  <Modal visible animationType="slide">
    <View style={{ flex: 1 }}>
      {hasPermission === null ? (
        <Text>Requesting camera permission...</Text>
      ) : hasPermission === false ? (
        <Text>No access to camera</Text>
      ) : (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ flex: 1 }}
        />
      )}

      <TouchableOpacity
        onPress={() => {
          setScanned(false);
          closeModal();
        }}
        style={{
          position: 'absolute',
          bottom: 40,
          alignSelf: 'center',
          backgroundColor: '#000',
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff' }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </Modal>
)}

{activeModal === 'manualCodeEntry' && (
  <Modal visible transparent animationType="slide" onRequestClose={closeModal}>
    <View style={styles.modalContainer}>
      <EventCodeEntry
        onSubmit={(code) => {
          setEnteredCode(code);
          handleEventAccess(code);
        }}
      />
      <TouchableOpacity onPress={closeModal} style={{ marginTop: 12 }}>
        <Text style={styles.closeText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </Modal>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 48,
    color: '#111827',
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000bb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  closeText: {
    color: '#facc15',
    fontSize: 16,
  },
});
