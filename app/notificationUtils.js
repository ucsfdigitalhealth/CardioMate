import * as Notifications from "expo-notifications";
import expoPushTokensApi from "./api/expoPushTokens";

export const registerForPushNotificationsAsync = async () => {
  try {
    const permission = await Notifications.requestPermissionsAsync();
    if (!permission.granted) return;
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    expoPushTokensApi.register(token);
  } catch (error) {
    console.log("Error getting a push token", error);
  }
};
