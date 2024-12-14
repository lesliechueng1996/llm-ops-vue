import { type BaseResponse } from './base'

export type GetCategoriesResponse = BaseResponse<
  Array<{
    category: string
    icon: string
    name: string
  }>
>

export type GetBuiltinToolsResponse = BaseResponse<
  Array<{
    background: string
    category: string
    created_at: number
    description: string
    label: string
    name: string
    tools: Array<unknown>
  }>
>
