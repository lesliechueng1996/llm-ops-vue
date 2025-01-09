import type {
  CreateAppRequest,
  GetAppDetailResponse,
  GetAppPublishHistoryResponse,
  GetAppsPaginationResponse,
  GetConversationMessagesPaginationResponse,
  GetDraftConfigResponse,
  UpdateAppInfoRequest,
  UpdateDraftConfigRequest,
} from '@/models/app-model'
import type { BasePaginationReq, BaseResponse } from '@/models/base'
import { del, get, post, put, ssePost } from '@/utils/request'

export const debugAppStream = (appId: string, query: string) => {
  return ssePost<{
    id: string
    conversation_id: string
    message_id: string
    task_id: string
    thought: string
    observation: string
    answer: string
    latency: number
    created_at: number
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

export const getConversationMessagesPagination = (
  pageParams: BasePaginationReq,
  appId: string,
  createdAt?: number,
) => {
  const params: Record<string, string | number | boolean> = {
    current_page: pageParams.current_page,
    page_size: pageParams.page_size,
  }

  if (createdAt) {
    params.created_at = createdAt
  }

  return get<GetConversationMessagesPaginationResponse>(`/apps/${appId}/conversations/messages`, {
    params,
  })
}

export const deleteDebugConversation = (appId: string) => {
  return del<BaseResponse<unknown>>(`/apps/${appId}/conversations/debug`)
}

export const stopConversationTask = (appId: string, taskId: string) => {
  return post<BaseResponse<unknown>>(`/apps/${appId}/conversations/tasks/${taskId}/stop`)
}

export const getAppsPagination = (req: BasePaginationReq) => {
  const params: Record<string, string | number | boolean> = {
    current_page: req.current_page,
    page_size: req.page_size,
  }
  if (req.search_word) {
    params.search_word = req.search_word
  }
  return get<GetAppsPaginationResponse>(`/apps`, {
    params,
  })
}

export const copyApp = (appId: string) => {
  return post<
    BaseResponse<{
      app_id: string
    }>
  >(`/apps/${appId}/copy`)
}

export const deleteApp = (appId: string) => {
  return del<BaseResponse<unknown>>(`/apps/${appId}`)
}

export const updateAppInfo = (req: UpdateAppInfoRequest, appId: string) => {
  return put<BaseResponse<unknown>>(`/apps/${appId}`, {
    body: req,
  })
}

export const createApp = (req: CreateAppRequest) => {
  return post<
    BaseResponse<{
      id: string
    }>
  >(`/apps`, {
    body: req,
  })
}
