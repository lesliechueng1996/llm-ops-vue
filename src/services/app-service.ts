import type { GetAppDetailResponse, GetAppPublishHistoryResponse } from '@/models/app-model'
import type { BasePaginationReq, BaseResponse } from '@/models/base'
import { get, post, ssePost } from '@/utils/request'

export const debugAppStream = (appId: string, query: string) => {
  return ssePost(`/apps/${appId}/conversations`, {
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
