import { type GetDocumentPaginationResponse } from '@/models/document-model'
import { type BasePaginationReq } from '@/models/base'
import { get } from '@/utils/request'

export const getDocumentPagination = async (
  datasetId: string,
  { current_page, page_size, search_word = '' }: BasePaginationReq,
) => {
  return get<GetDocumentPaginationResponse>(`/datasets/${datasetId}/documents`, {
    params: {
      current_page,
      page_size,
      search_word,
    },
  })
}
