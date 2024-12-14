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
    tools: Array<{
      name: string
      label: string
      description: string
      inputs: Array<{
        name: string
        description: string
        type: string
        required: boolean
      }>
      params: Array<{
        name: string
        label: string
        type: 'string' | 'number' | 'boolean' | 'select'
        required: boolean
        default: string | number | boolean
        min: number | null
        max: number | null
        help: string | null
        options: Array<{
          label: string
          value: string
        }>
      }>
    }>
  }>
>
