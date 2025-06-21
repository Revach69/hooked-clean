import React from 'react';
import { Alert, Button } from 'react-native';

type AlertDialogProps = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export function showAlertDialog({
  title,
  description,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: AlertDialogProps) {
  Alert.alert(
    title,
    description,
    [
      {
        text: cancelText,
        onPress: onCancel,
        style: 'cancel',
      },
      {
        text: confirmText,
        onPress: onConfirm,
      },
    ],
    { cancelable: true }
  );
}
