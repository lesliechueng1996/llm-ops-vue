import type { BasePaginationResponse, BaseResponse } from './base'

export type GetSegmentPaginationResponse = BasePaginationResponse<{
  id: string
  document_id: string
  dataset_id: string
  position: number
  content: string
  keywords: string[]
  character_count: number
  token_count: number
  hit_count: number
  enabled: boolean
  disabled_at: number
  status: string
  error: string
  updated_at: number
  created_at: number
}>

export type GetSegmentResponse = BaseResponse<{
  id: string
  document_id: string
  dataset_id: string
  position: number
  content: string
  keywords: string[]
  character_count: number
  token_count: number
  hit_count: number
  hash: string
  enabled: boolean
  disabled_at: number
  status: string
  error: string
  updated_at: number
  created_at: number
}>
