import { analytics } from '@/firebaseConfig'
import { logEvent } from 'firebase/analytics'

export const EventName = {
  webLogin: 'web_login',
  webLogout: 'web_logout',
}

export const useAnalytics = (eventName: keyof typeof EventName) => {
  return (eventParams = {}) => {
    if (!analytics) return

    logEvent(analytics, EventName[eventName], eventParams)
  }
}

