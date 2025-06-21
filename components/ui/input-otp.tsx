import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export const OTPInput = ({
  length = 6,
  onChange,
}: {
  length?: number;
  onChange?: (value: string) => void;
}) => {
  const [otp, setOtp] = React.useState<string[]>(Array(length).fill(''));

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // limit to one char
    setOtp(newOtp);
    onChange?.(newOtp.join(''));
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          style={styles.box}
          keyboardType="numeric"
          maxLength={1}
          value={digit}
          onChangeText={(value) => handleChange(index, value)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 10 },
  box: {
    width: 40,
    height: 50,
    borderBottomWidth: 2,
    borderColor: '#333',
    fontSize: 24,
    textAlign: 'center',
  },
});
