import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync(userId, jwtToken) {
  let token;

	console.log("Muc: ");
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

	console.log("Device: ", Device.isDevice);
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => {
				reject(new Error('Timeout getting push token'));
			}, 10000);
		});

		let pushTokenObject;
		const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

		try {
			pushTokenObject = await Promise.race([
				Notifications.getExpoPushTokenAsync({projectId}),
				timeoutPromise
			]);
		} catch (error) {
			console.log("push notification error: ", error.message);
			return;
		}
		token = pushTokenObject.data;
		if (token && userId && jwtToken) {
			await sendPushTokenToBackend(token, userId, jwtToken);
		}
	} else {
		alert('Must use physical device for Push Notifications');
	}

	return token;
}

async function sendPushTokenToBackend(token, userId, jwtToken) {
	try {
		await axios.post(`${apiUrl}/api/push-token/${userId}`, { expoPushToken: token }, {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
		});
	} catch (error) {
		console.error('Error sending Expo Push Token to backend:', error.response?.data || error.message);
	}
}
