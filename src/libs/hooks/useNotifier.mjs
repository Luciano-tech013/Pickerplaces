import { useState } from 'react';
import { TargetType } from "../../constants/notificationOptions.mjs";

export function useNotifier() {
  const [notification, setNotification] = useState({
      text: '',
      type: '',
      target: null  
  })

  const notify = (text, type, target = TargetType.NONE) => {
      handleNotification(text, type, target)
  }

  const reset = () => {
      handleNotification('', '', null);
  }

  const handleNotification = (text, type, target) => {
    setNotification(prevNotification => {
          let notificationCopy = {...prevNotification}
          notificationCopy.text = text
          notificationCopy.type = type
          notificationCopy.target = target

          return notificationCopy
      })
  }

  return {
    notification, notify, reset
  }
}