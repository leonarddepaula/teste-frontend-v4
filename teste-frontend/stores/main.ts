// stores/useStore.ts
//recisará criar esta interface/types

import type { Alert } from "~/types/types/alert"

export const useStore = defineStore('main', () => {
  const alerts = ref<Alert[]>([])

  const addAlert = (newAlert: Omit<Alert, 'timestamp'>) => {
    if (newAlert.equipmentId.trim() && newAlert.description.trim() && newAlert.severity) {
      alerts.value.push({
        ...newAlert,
        timestamp: Date.now()
      })
    }
  }

  return { alerts, addAlert }
}, {
  persist: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    key: 'alerts-local',
  }
})