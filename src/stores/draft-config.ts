import { defineStore } from 'pinia'
import type { GetDraftConfigResponse, UpdateDraftConfigRequest } from '@/models/app-model'
import { computed, reactive } from 'vue'
import {
  getDraftConfig,
  updateDraftConfig as updateDraftConfigService,
} from '@/services/app-service'
import { useRoute } from 'vue-router'

type DraftConfig = GetDraftConfigResponse['data']

export const useDraftConfigStore = defineStore('draft-config', () => {
  const route = useRoute()
  const appId = route.params.appId as string

  if (!appId) {
    throw new Error('appId is required')
  }

  const draftConfig = reactive<{
    data: DraftConfig | null
  }>({
    data: null,
  })

  const loadDraftConfig = async () => {
    const res = await getDraftConfig(appId)
    draftConfig.data = res.data
  }

  const updateDraftConfig = async (body: UpdateDraftConfigRequest) => {
    await updateDraftConfigService(appId, body)
  }

  // PresetPrompt
  const presetPrompt = computed({
    get: () => draftConfig.data?.preset_prompt,
    set: (value: string) => {
      if (draftConfig.data) {
        draftConfig.data.preset_prompt = value
      }
    },
  })

  const savePresetPrompt = async () => {
    if (draftConfig.data) {
      await updateDraftConfig({ preset_prompt: draftConfig.data.preset_prompt })
    }
  }

  // Long Term Memory
  const isLongTermMemoryEnabled = computed(() => draftConfig.data?.long_term_memory.enable ?? false)

  return {
    draftConfig,
    loadDraftConfig,
    presetPrompt,
    savePresetPrompt,
    updateDraftConfig,
    isLongTermMemoryEnabled,
  }
})
