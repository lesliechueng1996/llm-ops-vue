import type { BaseResponse, BasePaginationReq } from '@/models/base'
import type { CreateDatasetRequest, GetDatasetPaginationResponse } from '@/models/dataset-model'
import { get, post } from '@/utils/request'

export const createDataset = async (dataset: CreateDatasetRequest) => {
  return post<BaseResponse<unknown>>('/datasets', {
    body: dataset,
  })
}

export const getDatasetsByPagination = async ({
  page_size,
  current_page,
  search_word = '',
}: BasePaginationReq) => {
  return get<GetDatasetPaginationResponse>('/datasets', {
    params: {
      page_size,
      current_page,
      search_word,
    },
  })
}
