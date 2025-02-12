export type BaseResponse<T> = {
  code: string
  message: string
  data: T
}

export type BasePaginationResponse<T> = BaseResponse<{
  list: T[]
  paginator: {
    total_page: number
    total_record: number
    current_page: number
    page_size: number
  }
}>

export type BasePaginationReq = {
  current_page: number
  page_size: number
  search_word?: string
}
