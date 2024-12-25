import type { BasePaginationResponse } from './base'

export type CreateDatasetRequest = {
  name: string
  description: string
  icon: string
}

export type GetDatasetPaginationResponse = BasePaginationResponse<{
  id: string
  name: string
  icon: string
  description: string
  document_count: number
  character_count: number
  related_app_count: number
  updated_at: number
  created_at: number
}>

export type updateDatasetRequest = {
  name: string
  description: string
  icon: string
}

export type GetDatasetResponse = {
  id: string
  name: string
  icon: string
  description: string
  document_count: number
  hit_count: number
  related_app_count: number
  character_count: number
  updated_at: number
  created_at: number
}
