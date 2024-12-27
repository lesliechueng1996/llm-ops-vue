import type { BasePaginationReq, BaseResponse } from '@/models/base'
import type { GetSegmentPaginationResponse, GetSegmentResponse } from '@/models/segment-model'
import { del, get, post, put } from '@/utils/request'

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

export const deleteSegment = async (datasetId: string, documentId: string, id: string) => {
  return del(`/datasets/${datasetId}/documents/${documentId}/segments/${id}`)
}

export const updateSegmentEnabled = async (
  datasetId: string,
  documentId: string,
  id: string,
  enabled: boolean,
) => {
  return put(`/datasets/${datasetId}/documents/${documentId}/segments/${id}/enabled`, {
    body: {
      enabled,
    },
  })
}

export const createSegment = async (
  datasetId: string,
  documentId: string,
  content: string,
  keywords: string[],
) => {
  return post<BaseResponse<unknown>>(`/datasets/${datasetId}/documents/${documentId}/segments`, {
    body: {
      content,
      keywords,
    },
  })
}

export const updateSegment = async (
  datasetId: string,
  documentId: string,
  id: string,
  content: string,
  keywords: string[],
) => {
  return put<BaseResponse<unknown>>(
    `/datasets/${datasetId}/documents/${documentId}/segments/${id}`,
    {
      body: { content, keywords },
    },
  )
}

export const getSegment = async (datasetId: string, documentId: string, id: string) => {
  return get<GetSegmentResponse>(`/datasets/${datasetId}/documents/${documentId}/segments/${id}`)
}
