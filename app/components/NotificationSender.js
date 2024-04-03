import {
  scheduleNotificationAsync,
  getNotificationChannelsAsync,
} from "expo-notifications";

export const scheduleNotifications = async () => {
  // Check if notifications are already scheduled
  const channels = await getNotificationChannelsAsync();
  const existingChannels = channels.filter(
    (channel) => channel.id === "default"
  );

  if (existingChannels.length === 0) {
    const notificationTimes = [
      { hour: 8, minute: 0 },
      { hour: 9, minute: 0 },
      { hour: 10, minute: 0 },
      { hour: 11, minute: 0 },
      { hour: 12, minute: 0 },
      { hour: 13, minute: 0 },
      { hour: 14, minute: 0 },
      { hour: 15, minute: 0 },
      { hour: 16, minute: 0 },
      { hour: 17, minute: 0 },
      { hour: 18, minute: 0 },
      { hour: 19, minute: 0 },
      { hour: 20, minute: 0 },
      { hour: 21, minute: 0 },
    ];

    const now = new Date();

    for (const time of notificationTimes) {
      const triggerTime = new Date(now);
      triggerTime.setHours(time.hour, time.minute, 0, 0);

      if (triggerTime <= now) {
        // If the trigger time is in the past, schedule for the next day
        triggerTime.setDate(triggerTime.getDate() + 1);
      }

      // Generate a unique identifier for each notification based on the trigger time
      const notificationId = `notification_${time.hour}_${time.minute}`;
      const screenToNavigate = "Guidance";

      // Schedule the notification using the identifier and add vibration
      await scheduleNotificationAsync({
        identifier: notificationId, // Use the unique identifier
        content: {
          title: "Time to Check in!",
          body: "Hi, would you mind taking a second to measure your blood pressure and also log your current stress level? Thanks!",
          sound: "default", // "default" for the default notification sound
          vibrate: [1000, 500, 1000], // Vibrate for 1 second, pause for 0.5 seconds, vibrate for 1 second
          data: {
            path: "/notification",
          },
        },
        trigger: {
          date: triggerTime,
          repeats: true,
          seconds: 0,
        },
        channelId: "default",
      });
    }
  }
};
