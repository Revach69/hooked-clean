import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface AvatarProps {
  uri?: string;
  fallback?: string;
  size?: number;
}

export function Avatar({ uri, fallback = '?', size = 40 }: AvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={styles.fallback}>{fallback}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
