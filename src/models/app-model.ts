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
