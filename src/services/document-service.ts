import {
  type CreateDocumentsRequest,
  type CreateDocumentsResponse,
  type GetDocumentBatchResponse,
  type GetDocumentPaginationResponse,
} from '@/models/document-model'
import { type BasePaginationReq, type BaseResponse } from '@/models/base'
import { get, del, put, post } from '@/utils/request'

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

export const deleteDocument = (datasetId: string, documentId: string) => {
  return del(`/datasets/${datasetId}/documents/${documentId}`)
}

export const renameDocument = (datasetId: string, documentId: string, name: string) => {
  return put<BaseResponse<unknown>>(`/datasets/${datasetId}/documents/${documentId}/name`, {
    body: {
      name,
    },
  })
}

export const updateDocumentEnabled = (datasetId: string, documentId: string, enabled: boolean) => {
  return put<BaseResponse<unknown>>(`/datasets/${datasetId}/documents/${documentId}/enabled`, {
    body: {
      enabled,
    },
  })
}

export const getDocumentBatch = (datasetId: string, batchId: string) => {
  return get<GetDocumentBatchResponse>(`/datasets/${datasetId}/documents/batch/${batchId}`)
}

export const createDocuments = (datasetId: string, data: CreateDocumentsRequest) => {
  return post<CreateDocumentsResponse>(`/datasets/${datasetId}/documents`, {
    body: data,
  })
}
