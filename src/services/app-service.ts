import type { DebugAppResponse } from '@/models/app-model'
import { post } from '@/utils/request'

export const debugApp = async (appId: string, query: string): Promise<DebugAppResponse> => {
  return post(`/apps/${appId}/debug`, {
    body: { query },
  })
}
