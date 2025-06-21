import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type Props = {
  value: string;
  size?: number;
};

export default function QRCodeGenerator({ value, size = 200 }: Props) {
  return (
    <View style={styles.container}>
      <QRCode value={value} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
