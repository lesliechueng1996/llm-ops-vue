import type { GetAppDetailResponse } from '@/models/app-model'
import { getAppDetail } from '@/services/app-service'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export const useCurrentAppStore = defineStore('current-app', () => {
  const route = useRoute()
  const appId = route.params.appId as string

  if (!appId) {
    throw new Error('appId is required')
  }

  const currentApp = ref<GetAppDetailResponse['data']>()

  const loadCurrentApp = async () => {
    const res = await getAppDetail(appId as string)
    currentApp.value = res.data
  }

  return {
    currentApp,
    loadCurrentApp,
  }
})
