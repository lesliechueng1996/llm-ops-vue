import type { BaseResponse, BasePaginationReq } from '@/models/base'
import type {
  CreateDatasetRequest,
  GetDatasetPaginationResponse,
  updateDatasetRequest,
  GetDatasetResponse,
  HitTestingRequest,
  HitTestingResponse,
  DatasetRecentQueryResponse,
} from '@/models/dataset-model'
import { get, put, post, del } from '@/utils/request'

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

export const deleteDataset = async (id: string) => {
  return del<BaseResponse<unknown>>(`/datasets/${id}`)
}

export const hitTesting = async (datasetId: string, request: HitTestingRequest) => {
  return post<HitTestingResponse>(`/datasets/${datasetId}/hit`, {
    body: request,
  })
}

export const getDatasetRecentQuery = async (datasetId: string) => {
  return get<DatasetRecentQueryResponse>(`/datasets/${datasetId}/queries`)
}
