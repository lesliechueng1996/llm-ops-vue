import { type BasePaginationResponse } from './base'

export type GetApiToolProvidersWithPageResponse = BasePaginationResponse<{
  id: number
  name: string
  icon: string
  description: string
  headers: Array<{
    key: string
    value: string
  }>
  tools: Array<{
    id: string
    name: string
    description: string
    inputs: Array<{
      name: string
      type: string
      required: boolean
      description: string
    }>
  }>
  created_at: number
}>
