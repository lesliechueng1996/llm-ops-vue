import { type GetApiKeyPaginationRes } from '@/models/api-key-model'
import type { BasePaginationReq } from '@/models/base'
import { del, get, post, put } from '@/utils/request'

export const getApiKeyPagination = (params: BasePaginationReq) => {
  return get<GetApiKeyPaginationRes>('/openapi/api-keys', {
    params: {
      current_page: params.current_page,
      page_size: params.page_size,
    },
  })
}

export const changeApiKeyActive = (id: string, value: boolean) => {
  return put(`/openapi/api-keys/${id}/is-active`, {
    body: {
      is_active: value,
    },
  })
}

export const createApiKey = (isActive: boolean, remark: string) => {
  return post('/openapi/api-keys', {
    body: {
      is_active: isActive,
      remark,
    },
  })
}

export const updateApiKey = (id: string, isActive: boolean, remark: string) => {
  return put(`/openapi/api-keys/${id}`, {
    body: {
      is_active: isActive,
      remark,
    },
  })
}

export const deleteApiKey = (id: string) => {
  return del(`/openapi/api-keys/${id}`)
}
