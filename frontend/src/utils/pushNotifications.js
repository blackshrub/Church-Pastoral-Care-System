// Push Notification Manager
class PushNotificationManager {
  constructor() {
    this.vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HcCWLrRgwjdLVJstfncc8BhKCFKdlHEyGGEfpIGUgMzHhDfQZbJL2PY9jY'; // Example key
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
  }

  async requestPermission() {
    if (!this.isSupported) {
      console.warn('Push notifications not supported');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async subscribeToPush() {
    if (!this.isSupported) return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      // Send subscription to backend
      await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(subscription)
      });

      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Send urgent care notifications
  async sendUrgentCareNotification(memberName, urgencyType) {
    if (!this.isSupported) return;

    try {
      await fetch('/api/push-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: 'Urgent Pastoral Care',
          message: `${memberName} needs immediate attention - ${urgencyType}`,
          urgency: 'high',
          actions: [
            { action: 'contact', title: 'Contact Now' },
            { action: 'view', title: 'View Profile' }
          ]
        })
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }
}

export const pushManager = new PushNotificationManager();