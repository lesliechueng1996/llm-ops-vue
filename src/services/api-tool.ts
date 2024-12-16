import {
  type CreateApiToolsRequest,
  type CreateApiToolsResponse,
  type GetApiToolProvidersWithPageResponse,
  type ValidateOpenapiSchemaResponse,
} from '@/models/api-tool'
import { get, post } from '@/utils/request'

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
