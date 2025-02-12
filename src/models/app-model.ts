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
    type: 'builtin_tool' | 'api_tool'
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
      params: Record<string, string | number | boolean>
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
    retrieval_strategy: 'full_text' | 'semantic' | 'hybrid'
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
  suggested_after_answer: {
    enable: boolean
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
    params: Record<string, string | number | boolean>
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
  suggested_after_answer?: {
    enable: boolean
  }
}

export enum QueueEvent {
  LONG_TERM_MEMORY_RECALL = 'long_term_memory_recall',
  AGENT_THOUGHT = 'agent_thought',
  AGENT_MESSAGE = 'agent_message',
  AGENT_ACTION = 'agent_action',
  DATASET_RETRIEVAL = 'dataset_retrieval',
  AGENT_END = 'agent_end',
  STOP = 'stop',
  ERROR = 'error',
  TIMEOUT = 'timeout',
  PING = 'ping',
}

export type GetConversationMessagesPaginationResponse = BasePaginationResponse<{
  id: string
  conversation_id: string
  query: string
  answer: string
  total_token_count: number
  latency: number
  agent_thoughts: {
    id: string
    position: number
    event: QueueEvent
    thought: string
    observation: string
    tool: string
    tool_input: Record<string, unknown>
    latency: number
    created_at: number
  }[]
  created_at: number
}>

export type GetAppsPaginationResponse = BasePaginationResponse<{
  id: string
  name: string
  icon: string
  description: string
  preset_prompt: string
  model_config: {
    provider: string
    model: string
  }
  status: string
  updated_at: number
  created_at: number
}>

export type UpdateAppInfoRequest = {
  name: string
  icon: string
  description: string
}

export type CreateAppRequest = {
  name: string
  icon: string
  description: string
}
