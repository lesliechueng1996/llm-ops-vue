import type { GetAppDetailResponse } from '@/models/app-model'
import type { BaseResponse } from '@/models/base'
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
