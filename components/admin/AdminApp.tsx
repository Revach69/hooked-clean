// components/admin/AdminApp.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const AdminApp: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Hooked Admin Panel</Text>
      {/* You can render your modals or routes here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
});

export default AdminApp;
