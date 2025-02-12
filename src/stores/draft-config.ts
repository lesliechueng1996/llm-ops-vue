import { defineStore } from 'pinia'
import type { GetDraftConfigResponse, UpdateDraftConfigRequest } from '@/models/app-model'
import { computed, reactive } from 'vue'
import {
  getDraftConfig,
  updateDraftConfig as updateDraftConfigService,
} from '@/services/app-service'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'

type DraftConfig = GetDraftConfigResponse['data']

export const useDraftConfigStore = defineStore('draft-config', () => {
  const route = useRoute()
  const appId = computed(() => route.params.appId as string)

  if (!appId.value) {
    throw new Error('appId is required')
  }

  const draftConfig = reactive<{
    data: DraftConfig | null
  }>({
    data: null,
  })

  const loadDraftConfig = async () => {
    const res = await getDraftConfig(appId.value)
    draftConfig.data = res.data
  }

  const updateDraftConfig = async (body: UpdateDraftConfigRequest) => {
    await updateDraftConfigService(appId.value, body)
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
  const isLongTermMemoryEnabled = computed({
    get: () => draftConfig.data?.long_term_memory.enable ?? false,
    set: (value: boolean) => {
      if (draftConfig.data) {
        draftConfig.data.long_term_memory.enable = value
      }
      updateDraftConfig({ long_term_memory: { enable: value } }).then(() => {
        Message.success('保存成功')
      })
    },
  })

  // Opening Statement
  const openingStatement = computed({
    get: () => draftConfig.data?.opening_statement,
    set: (value: string) => {
      if (draftConfig.data) {
        draftConfig.data.opening_statement = value
      }
    },
  })

  const saveOpeningStatement = async () => {
    if (draftConfig.data) {
      await updateDraftConfig({ opening_statement: draftConfig.data.opening_statement })
    }
  }

  // Opening Questions
  const openingQuestions = computed(() => draftConfig.data?.opening_questions ?? [])

  const addOpeningQuestion = () => {
    if (draftConfig.data && draftConfig.data.opening_questions.length < 3) {
      draftConfig.data.opening_questions.push('')
    }
  }

  const removeOpeningQuestion = (index: number) => {
    if (draftConfig.data && draftConfig.data.opening_questions.length > 0) {
      draftConfig.data.opening_questions.splice(index, 1)
    }
  }

  const saveOpeningQuestions = async () => {
    if (draftConfig.data) {
      await updateDraftConfig({ opening_questions: draftConfig.data.opening_questions })
    }
  }

  // Suggested After Answer
  const isSuggestedAfterAnswerEnabled = computed({
    get: () => draftConfig.data?.suggested_after_answer?.enable ?? false,
    set: (value: boolean) => {
      if (draftConfig.data) {
        draftConfig.data.suggested_after_answer.enable = value
      }
      updateDraftConfig({ suggested_after_answer: { enable: value } }).then(() => {
        Message.success('保存成功')
      })
    },
  })

  // Review Config
  const isReviewConfigEnabled = computed({
    get: () => draftConfig.data?.review_config?.enable ?? false,
    set: (value: boolean) => {
      if (draftConfig.data) {
        draftConfig.data.review_config.enable = value
        if (value === false) {
          updateDraftConfig({
            review_config: {
              enable: false,
              keywords: draftConfig.data.review_config.keywords,
              inputs_config: {
                enable: false,
                preset_response: draftConfig.data.review_config.inputs_config.preset_response,
              },
              outputs_config: {
                enable: false,
              },
            },
          }).then(() => {
            Message.success('保存成功')
          })
        }
      }
    },
  })

  const reviewConfig = computed({
    get: () => draftConfig.data?.review_config ?? null,
    set: (value: DraftConfig['review_config']) => {
      if (draftConfig.data) {
        draftConfig.data.review_config = value
      }
    },
  })

  const saveReviewConfig = async () => {
    if (draftConfig.data) {
      await updateDraftConfig({ review_config: draftConfig.data.review_config })
    }
  }

  // Dataset Reference
  const datasets = computed({
    get: () => draftConfig.data?.datasets ?? [],
    set: (value: DraftConfig['datasets']) => {
      if (draftConfig.data) {
        draftConfig.data.datasets = value
      }
    },
  })

  const saveDatasets = async () => {
    if (draftConfig.data) {
      await updateDraftConfig({ datasets: draftConfig.data.datasets.map((dataset) => dataset.id) })
    }
  }

  const retrievalConfig = computed({
    get: () => draftConfig.data?.retrieval_config ?? null,
    set: (value: DraftConfig['retrieval_config']) => {
      if (draftConfig.data) {
        draftConfig.data.retrieval_config = value
      }
    },
  })

  const saveRetrievalConfig = async () => {
    if (draftConfig.data) {
      await updateDraftConfig({ retrieval_config: draftConfig.data.retrieval_config })
    }
  }

  // Tool Reference
  const tools = computed({
    get: () => draftConfig.data?.tools ?? [],
    set: (value: DraftConfig['tools']) => {
      if (draftConfig.data) {
        draftConfig.data.tools = value
      }
    },
  })

  const saveTools = async () => {
    if (draftConfig.data) {
      await updateDraftConfig({
        tools: draftConfig.data.tools.map((tool) => ({
          type: tool.type,
          provider_id: tool.provider.id,
          tool_id: tool.tool.id,
          params: tool.tool.params,
        })),
      })
    }
  }

  return {
    draftConfig,
    loadDraftConfig,
    presetPrompt,
    savePresetPrompt,
    updateDraftConfig,
    isLongTermMemoryEnabled,
    openingStatement,
    saveOpeningStatement,
    openingQuestions,
    addOpeningQuestion,
    removeOpeningQuestion,
    saveOpeningQuestions,
    isSuggestedAfterAnswerEnabled,
    isReviewConfigEnabled,
    reviewConfig,
    saveReviewConfig,
    datasets,
    retrievalConfig,
    saveDatasets,
    saveRetrievalConfig,
    tools,
    saveTools,
  }
})
