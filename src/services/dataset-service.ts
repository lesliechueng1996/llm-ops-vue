import type { BaseResponse, BasePaginationReq } from '@/models/base'
import type {
  CreateDatasetRequest,
  GetDatasetPaginationResponse,
  updateDatasetRequest,
  GetDatasetResponse,
} from '@/models/dataset-model'
import { get, put, post } from '@/utils/request'

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

export const updateDataset = async (id: string, dataset: updateDatasetRequest) => {
  return put<BaseResponse<unknown>>(`/datasets/${id}`, {
    body: dataset,
  })
}

export const getDataset = async (id: string) => {
  return get<BaseResponse<GetDatasetResponse>>(`/datasets/${id}`)
}
