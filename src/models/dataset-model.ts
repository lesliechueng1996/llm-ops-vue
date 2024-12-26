import type { BasePaginationResponse, BaseResponse } from './base'

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

export type HitTestingStrategy = 'hybrid' | 'semantic' | 'full_text'

export type HitTestingRequest = {
  query: string
  retrieval_strategy: HitTestingStrategy
  k: number
  score: number
}

export type HitTestingResponse = BaseResponse<
  {
    id: string
    document: {
      id: string
      name: string
      extension: string
      mime_type: string
    }
    dataset_id: string
    position: number
    score: number
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
  }[]
>

export type DatasetRecentQueryResponse = BaseResponse<
  {
    id: string
    dataset_id: string
    query: string
    source: string
    created_at: number
  }[]
>
