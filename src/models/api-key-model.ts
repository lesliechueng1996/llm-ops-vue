import type { BasePaginationResponse } from './base'

export type GetApiKeyPaginationRes = BasePaginationResponse<{
  id: string
  created_at: number
  updated_at: number
  api_key: string
  is_active: boolean
  remark: string
}>
