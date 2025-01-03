import { get } from '@/utils/request'
import {
  type GetCategoriesResponse,
  type GetBuiltinToolsResponse,
  type GetSpecificBuiltinToolResponse,
} from '@/models/builtin-tool'

export const getCategories = () => {
  return get<GetCategoriesResponse>('/builtin-tools/categories')
}

export const getBuiltinTools = () => {
  return get<GetBuiltinToolsResponse>('/builtin-tools')
}

export const getSpecificBuiltinTool = (providerId: string, toolId: string) => {
  return get<GetSpecificBuiltinToolResponse>(`/builtin-tools/${providerId}/tools/${toolId}`)
}
