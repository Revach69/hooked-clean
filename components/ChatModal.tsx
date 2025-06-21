import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  AppState,
} from 'react-native';
import { Message, ContactShare } from '@/api/entities';
import { getCurrentEventId, getCurrentSessionId } from '@/utils/session';
import ContactShareModal from './ContactShareModal';

interface Props {
  match: any;
  onClose: () => void;
}

export default function ChatModal({ match, onClose }: Props) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showContactShare, setShowContactShare] = useState(false);
  const [hasSharedContact, setHasSharedContact] = useState(false);
  const [receivedContact, setReceivedContact] = useState<any>(null);

  const listRef = useRef<FlatList<any>>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const matchId = sessionId ? [sessionId, match.session_id].sort().join('_') : '';

  useEffect(() => {
    (async () => {
      const [sid, eid] = await Promise.all([
        getCurrentSessionId(),
        getCurrentEventId(),
      ]);
      setSessionId(sid);
      setEventId(eid);
    })();
  }, []);

  const markAsRead = useCallback(async () => {
    if (!sessionId || !eventId || !matchId) return;
    try {
      const unread = await Message.filter({
        match_id: matchId,
        receiver_session_id: sessionId,
        is_read: false,
        event_id: eventId,
      });
      await Promise.all(unread.map((m: any) => Message.update(m.id, { is_read: true })));
    } catch (e) {
      console.warn('mark read error', e);
    }
  }, [matchId, sessionId, eventId]);

  const loadMessages = useCallback(async () => {
    if (!eventId || !matchId) return;
    try {
      const list = await Message.filter({ event_id: eventId, match_id: matchId }, 'created_date');
      setMessages(list);
      markAsRead();
    } catch (e) {
      console.error('load messages', e);
    }
    setIsLoading(false);
  }, [eventId, matchId, markAsRead]);

  const loadContactShares = useCallback(async () => {
    if (!eventId || !matchId || !sessionId) return;
    try {
      const mine = await ContactShare.filter({ event_id: eventId, match_id: matchId, sharer_session_id: sessionId });
      if (mine.length > 0) setHasSharedContact(true);
      const theirs = await ContactShare.filter({
        event_id: eventId,
        match_id: matchId,
        sharer_session_id: match.session_id,
        recipient_session_id: sessionId,
      });
      if (theirs.length > 0) setReceivedContact(theirs[0]);
    } catch (e) {
      console.warn('share load', e);
    }
  }, [eventId, matchId, sessionId, match.session_id]);

  const sendMessage = async () => {
    if (!sessionId || !eventId || !newMessage.trim()) return;
    const content = newMessage.trim();
    setNewMessage('');
    const temp = { id: `temp_${Date.now()}`, content, sender_session_id: sessionId, created_date: new Date().toISOString() };
    setMessages((prev) => [...prev, temp]);
    try {
      await Message.create({
        event_id: eventId,
        sender_session_id: sessionId,
        receiver_session_id: match.session_id,
        content,
        match_id: matchId,
        is_read: false,
      });
    } catch (e) {
      console.error('send err', e);
      setMessages((prev) => prev.filter((m) => m.id !== temp.id));
      setNewMessage(content);
    }
  };

  const handleShareContact = async (info: { fullName: string; phoneNumber: string }) => {
    try {
      await ContactShare.create({
        event_id: eventId,
        match_id: matchId,
        sharer_session_id: sessionId,
        recipient_session_id: match.session_id,
        full_name: info.fullName,
        phone_number: info.phoneNumber,
      });
      setHasSharedContact(true);
      setShowContactShare(false);
      loadContactShares();
    } catch (e) {
      console.error('share contact', e);
      throw e;
    }
  };

  useEffect(() => {
    if (!sessionId || !eventId) return;
    loadMessages();
    loadContactShares();
    const interval = setInterval(() => {
      if (AppState.currentState === 'active') {
        loadMessages();
        loadContactShares();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [loadMessages, loadContactShares, sessionId, eventId]);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.title}>{match.first_name}</Text>
          <View style={styles.headerActions}>
            {!hasSharedContact && (
              <TouchableOpacity onPress={() => setShowContactShare(true)} style={styles.shareBtn}>
                <Text style={styles.shareText}>Share Contact</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          {receivedContact && (
            <View style={styles.receivedBox}>
              <Text style={styles.receivedLabel}>Contact from {match.first_name}</Text>
              <Text style={styles.receivedText}>{receivedContact.full_name}</Text>
              <Text style={styles.receivedText}>{receivedContact.phone_number}</Text>
            </View>
          )}
        </View>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.msgRow, item.sender_session_id === sessionId ? styles.me : styles.them]}>
              <Text style={styles.msgText}>{item.content}</Text>
              <Text style={styles.msgTime}>{new Date(item.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          )}
          contentContainerStyle={styles.messages}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={`Message ${match.first_name}...`}
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity onPress={sendMessage} disabled={!newMessage.trim()} style={styles.sendBtn}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {showContactShare && (
        <ContactShareModal
          visible={showContactShare}
          matchName={match.first_name}
          onConfirm={handleShareContact}
          onClose={() => setShowContactShare(false)}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 18, fontWeight: '600' },
  headerActions: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
  shareBtn: { marginRight: 12, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#6366f1', borderRadius: 6 },
  shareText: { color: '#fff' },
  closeBtn: { padding: 6 },
  closeText: { color: '#ef4444' },
  receivedBox: { marginTop: 12, padding: 8, backgroundColor: '#eef2ff', borderRadius: 8 },
  receivedLabel: { fontWeight: '600', marginBottom: 4 },
  receivedText: { fontSize: 12 },
  messages: { flexGrow: 1, padding: 16 },
  msgRow: { maxWidth: '80%', padding: 8, borderRadius: 10, marginBottom: 8 },
  me: { backgroundColor: '#c7d2fe', alignSelf: 'flex-end' },
  them: { backgroundColor: '#f3f4f6', alignSelf: 'flex-start' },
  msgText: { fontSize: 14 },
  msgTime: { fontSize: 10, color: '#555', marginTop: 2, textAlign: 'right' },
  inputRow: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: '#eee' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  sendBtn: { alignSelf: 'center', backgroundColor: '#6366f1', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  sendText: { color: '#fff', fontWeight: '600' },
});
