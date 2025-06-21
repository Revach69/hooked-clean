import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getCurrentSessionId(): Promise<string | null> {
  return AsyncStorage.getItem('currentSessionId');
}

export async function getCurrentEventId(): Promise<string | null> {
  return AsyncStorage.getItem('currentEventId');
}

export async function setCurrentSessionId(id: string) {
  await AsyncStorage.setItem('currentSessionId', id);
}

export async function setCurrentEventId(id: string) {
  await AsyncStorage.setItem('currentEventId', id);
}
