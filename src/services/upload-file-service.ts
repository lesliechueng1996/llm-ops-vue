import { upload } from '@/utils/request'
import { type UploadFileResponse, type UploadImageResponse } from '@/models/upload-file-model'

export const uploadFile = (file: File, onProgress?: (progress: number) => void) => {
  return upload<UploadFileResponse>('/upload-files/file', file, { onProgress })
}

export const uploadImage = (file: File, onProgress?: (progress: number) => void) => {
  return upload<UploadImageResponse>('/upload-files/image', file, { onProgress })
}
