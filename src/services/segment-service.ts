import type { BasePaginationReq } from '@/models/base'
import type { GetSegmentPaginationResponse } from '@/models/segment-model'
import { get } from '@/utils/request'

export const getSegmentsByPagination = async (
  datasetId: string,
  documentId: string,
  { page_size, current_page, search_word = '' }: BasePaginationReq,
) => {
  return get<GetSegmentPaginationResponse>(
    `/datasets/${datasetId}/documents/${documentId}/segments`,
    {
      params: {
        page_size,
        current_page,
        search_word,
      },
    },
  )
}
