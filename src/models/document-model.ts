import type { BasePaginationResponse } from './base'

export type GetDocumentPaginationResponse = BasePaginationResponse<{
  id: string
  name: string
  character_count: number
  hit_count: number
  position: number
  enabled: boolean
  disabled_at: number
  status: string
  error: string
  updated_at: number
  created_at: number
}>
