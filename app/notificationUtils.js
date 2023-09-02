import * as Notifications from "expo-notifications";

export const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notification permissions denied");
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Notification token:", token);
};
