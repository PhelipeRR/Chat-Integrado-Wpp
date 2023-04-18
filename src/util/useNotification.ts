import { ref } from 'vue'

interface NotificationOptions {
  title: string,
  message: string,
  icon?: string
}

export default function useNotification() {
  const permission = ref(Notification.permission)

  const requestPermission = async () => {
    const result = await Notification.requestPermission()
    permission.value = result
  }

  const showNotification = ({ title, message, icon }: NotificationOptions) => {
    if (permission.value !== 'granted') {
      console.warn('Notification permission not granted')
      return
    }

    const options: NotificationOptions = {
      title: title,
      message: message
    }

    if (icon) {
      options.icon = icon
    }

    const notification = new Notification(title, options)
    notification.onclick = () => {
      // handle click event
    }
  }

  return {
    permission,
    requestPermission,
    showNotification
  }
}
