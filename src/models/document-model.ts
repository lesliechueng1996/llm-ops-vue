import type { BasePaginationResponse, BaseResponse } from './base'

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

export type GetDocumentBatchResponse = BaseResponse<
  {
    id: string
    name: string
    size: number
    extension: string
    mime_type: string
    position: number
    segment_count: number
    completed_segment_count: number
    error: string
    status: string
    processing_started_at: number
    parsing_completed_at: number
    splitting_completed_at: number
    completed_at: number
    stopped_at: number
    created_at: number
  }[]
>

export type CreateDocumentsRequest = {
  upload_file_ids: string[]
  process_type: 'automatic' | 'custom'
  rule?: {
    pre_process_rule: {
      id: string
      enabled: boolean
    }[]
    segment: {
      separator: string[]
      chunk_size: number
      chunk_overlap: number
    }
  }
}

export type CreateDocumentsResponse = BaseResponse<{
  batch: string
  documents: {
    id: string
    name: string
    status: string
    created_at: number
  }[]
}>
