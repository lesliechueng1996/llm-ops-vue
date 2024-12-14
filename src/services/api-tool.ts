import { type GetApiToolProvidersWithPageResponse } from '@/models/api-tool'
import { get } from '@/utils/request'

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
