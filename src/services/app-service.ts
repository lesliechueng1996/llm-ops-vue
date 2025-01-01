import type {
  GetAppDetailResponse,
  GetAppPublishHistoryResponse,
  GetDraftConfigResponse,
  UpdateDraftConfigRequest,
} from '@/models/app-model'
import type { BasePaginationReq, BaseResponse } from '@/models/base'
import { get, post, put, ssePost } from '@/utils/request'

export const debugAppStream = (appId: string, query: string) => {
  return ssePost<{
    id: string
    task_id: string
    event: string
    thought: string
    observation: string
    tool: string
    tool_input: string
    answer: string
    latency: number
  }>(`/apps/${appId}/conversations`, {
    body: { query },
  })
}

export const getAppDetail = (appId: string) => {
  return get<GetAppDetailResponse>(`/apps/${appId}`)
}

export const publishApp = (appId: string) => {
  return post<BaseResponse<unknown>>(`/apps/${appId}/publish`)
}

export const cancelPublishApp = (appId: string) => {
  return post<BaseResponse<unknown>>(`/apps/${appId}/cancel-publish`)
}

export const getAppPublishHistory = (appId: string, params: BasePaginationReq) => {
  return get<GetAppPublishHistoryResponse>(`/apps/${appId}/publish-histories`, {
    params: {
      current_page: params.current_page,
      page_size: params.page_size,
    },
  })
}

export const fallbackHistory = (appId: string, configVersionId: string) => {
  return post<BaseResponse<unknown>>(`/apps/${appId}/fallback-history`, {
    body: {
      app_config_version_id: configVersionId,
    },
  })
}

export const getDraftConfig = (appId: string) => {
  return get<GetDraftConfigResponse>(`/apps/${appId}/draft-app-config`)
}

export const updateDraftConfig = (appId: string, body: UpdateDraftConfigRequest) => {
  return put<BaseResponse<unknown>>(`/apps/${appId}/draft-app-config`, {
    body,
  })
}

export const getLongTermMemory = (appId: string) => {
  return get<
    BaseResponse<{
      summary: string
    }>
  >(`/apps/${appId}/summary`)
}

export const updateLongTermMemory = (appId: string, summary: string) => {
  return put<BaseResponse<unknown>>(`/apps/${appId}/summary`, {
    body: {
      summary,
    },
  })
}
