import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

export const useToast = () => {
  const show = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    Toast.show({
      type,
      text1: message,
      position: 'bottom',
    });
  }, []);

  return { show };
};
