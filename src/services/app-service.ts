import type { DebugAppResponse } from '@/models/app-model'
import { post, ssePost } from '@/utils/request'

export const debugApp = async (appId: string, query: string): Promise<DebugAppResponse> => {
  return post(`/apps/${appId}/debug`, {
    body: { query },
  })
}

export const debugAppStream = (appId: string, query: string) => {
  return ssePost(`/apps/${appId}/debug`, {
    body: { query },
  })
}
