import { type BaseResponse } from './base'

export type UploadFileResponse = BaseResponse<{
  id: string
  account_id: string
  name: string
  key: string
  size: number
  extension: string
  mime_type: string
  created_at: string
}>

export type UploadImageResponse = BaseResponse<{
  image_url: string
}>
