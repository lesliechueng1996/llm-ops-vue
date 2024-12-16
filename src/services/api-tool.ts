import {
  type CreateApiToolsRequest,
  type CreateApiToolsResponse,
  type GetApiToolProvidersWithPageResponse,
  type GetApiToolResponse,
  type UpdateApiToolRequest,
  type ValidateOpenapiSchemaResponse,
} from '@/models/api-tool'
import type { BaseResponse } from '@/models/base'
import { get, post, put, del } from '@/utils/request'

export const getApiToolProvidersWithPage = async (
  searchWord: string = '',
  page: number = 0,
  pageSize: number = 20,
) => {
  return get<GetApiToolProvidersWithPageResponse>('/api-tools', {
    params: {
      search_word: searchWord,
      current_page: page,
      page_size: pageSize,
    },
  })
}

export const createApiTools = async (data: CreateApiToolsRequest) => {
  return post<CreateApiToolsResponse>('/api-tools', {
    body: data,
  })
}

export const validateOpenapiSchema = async (schema: string) => {
  return post<ValidateOpenapiSchemaResponse>('/api-tools/validate-openapi-schema', {
    body: {
      openapi_schema: schema,
    },
  })
}

export const getApiTool = async (providerId: string) => {
  return get<GetApiToolResponse>(`/api-tools/${providerId}`)
}

export const updateApiTool = async (providerId: string, data: UpdateApiToolRequest) => {
  return put<BaseResponse<unknown>>(`/api-tools/${providerId}`, {
    body: data,
  })
}

export const deleteApiTool = async (providerId: string) => {
  return del<BaseResponse<unknown>>(`/api-tools/${providerId}`)
}
