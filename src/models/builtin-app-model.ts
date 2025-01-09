import type { BaseResponse } from './base'

export type GetBuiltinAppCategoriesResponse = BaseResponse<
  {
    category: string
    name: string
  }[]
>

export type GetAllBuiltinAppsResponse = BaseResponse<
  {
    id: string
    category: string
    name: string
    icon: string
    description: string
    model_config: {
      provider: string
      model: string
    }
    created_at: number
  }[]
>
