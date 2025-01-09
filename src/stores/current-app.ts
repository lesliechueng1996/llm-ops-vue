import type { GetAppDetailResponse } from '@/models/app-model'
import { getAppDetail } from '@/services/app-service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrentAppStore = defineStore('current-app', () => {
  const currentApp = ref<GetAppDetailResponse['data']>()

  const loadCurrentApp = async (appId: string) => {
    const res = await getAppDetail(appId as string)
    currentApp.value = res.data
  }

  return {
    currentApp,
    loadCurrentApp,
  }
})
