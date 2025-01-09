import type { BaseResponse } from '@/models/base'
import type {
  GetAllBuiltinAppsResponse,
  GetBuiltinAppCategoriesResponse,
} from '@/models/builtin-app-model'
import { get, post } from '@/utils/request'

export const getBuiltinAppCategories = () => {
  return get<GetBuiltinAppCategoriesResponse>('/builtin-apps/app-categories')
}

export const getAllBuiltinApps = () => {
  return get<GetAllBuiltinAppsResponse>('/builtin-apps')
}

export const addBuiltinAppToSpace = (builtinAppId: string) => {
  return post<
    BaseResponse<{
      id: string
    }>
  >('/builtin-apps/add-builtin-app-to-space', {
    body: {
      builtin_app_id: builtinAppId,
    },
  })
}
