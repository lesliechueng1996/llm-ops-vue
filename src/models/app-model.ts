import type { BasePaginationResponse, BaseResponse } from './base'

export type DebugAppResponse = BaseResponse<{
  content: string
}>

export type GetAppDetailResponse = BaseResponse<{
  id: string
  debug_conversation_id: string
  name: string
  icon: string
  description: string
  status: string
  draft_updated_at: number
  updated_at: number
  created_at: number
}>

export type GetAppPublishHistoryResponse = BasePaginationResponse<{
  id: string
  version: number
  created_at: number
}>

export type GetDraftConfigResponse = BaseResponse<{
  id: string
  model_config: {
    provider: string
    model: string
    parameters: Record<string, unknown>
  }
  dialog_round: number
  preset_prompt: string
  tools: {
    type: string
    provider: {
      id: string
      name: string
      label: string
      icon: string
      description: string
    }
    tool: {
      id: string
      name: string
      label: string
      description: string
      params: Record<string, unknown>
    }
  }[]
  workflows: {
    id: string
    name: string
    icon: string
    description: string
  }[]
  datasets: {
    id: string
    name: string
    icon: string
    description: string
  }[]
  retrieval_config: {
    retrieval_strategy: string
    k: number
    score: number
  }
  long_term_memory: {
    enable: boolean
  }
  opening_statement: string
  opening_questions: string[]
  speech_to_text: {
    enable: boolean
  }
  text_to_speech: {
    enable: boolean
    voice: string
    auto_play: boolean
  }
  review_config: {
    enable: boolean
    keywords: string[]
    inputs_config: {
      enable: boolean
      preset_response: string
    }
    outputs_config: {
      enable: boolean
    }
  }
  updated_at: number
  created_at: number
}>

export type UpdateDraftConfigRequest = {
  model_config?: {
    provider: string
    model: string
    parameters: Record<string, unknown>
  }
  dialog_round?: number
  preset_prompt?: string
  tools?: {
    type: 'builtin_tool' | 'api_tool'
    provider_id: string
    tool_id: string
    params: Record<string, unknown>
  }[]
  workflows?: string[]
  datasets?: string[]
  retrieval_config?: {
    retrieval_strategy: 'full_text' | 'semantic' | 'hybrid'
    k: number
    score: number
  }
  long_term_memory?: {
    enable: boolean
  }
  opening_statement?: string
  opening_questions?: string[]
  speech_to_text?: {
    enable: boolean
  }
  text_to_speech?: {
    enable: boolean
    voice: string
    auto_play: boolean
  }
  review_config?: {
    enable: boolean
    keywords: string[]
    inputs_config: {
      enable: boolean
      preset_response: string
    }
    outputs_config: {
      enable: boolean
    }
  }
}
