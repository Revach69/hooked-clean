import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,   // ✅ new required field
      shouldShowList: true      // ✅ new required field
    }),
  });
export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Register for push and ask for permission if not yet granted
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        // 🔁 Optionally send token to your backend
      }
    });

    // Listen for foreground notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Handle when user taps a notification (background or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;

      if (data.type === 'chat' && data.chatId) {
        router.push(`/chat/${data.chatId}`);
      } else if (data.type === 'match') {
        router.push('/Matches');
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return { expoPushToken, notification };
}

// Ask for permissions and return token if granted
async function registerForPushNotificationsAsync(): Promise<Notifications.ExpoPushToken | null> {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted.');
      return null;
    }

    token = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-expo-project-id-here',
    });

    return token;
  } else {
    console.log('Must use physical device for push notifications');
    return null;
  }
}
