<script setup lang="ts">
import {
  Message,
  type FileItem,
  type RequestOption,
  type UploadRequest,
} from '@arco-design/web-vue'
import { ref } from 'vue'
import { uploadFile } from '@/services/upload-file-service'
import type { UploadFileResponse } from '@/models/upload-file-model'

const fileList = ref<FileItem[]>([])

const emit = defineEmits<{
  (e: 'finish', isFinished: boolean, fileIds?: string[]): void
}>()

const uploadFiles = (option: RequestOption): UploadRequest => {
  const { fileItem, onProgress, onError, onSuccess } = option
  const result: UploadRequest = {}

  const file = fileItem.file
  if (!file) {
    onError(new Error('文件为空'))
    return result
  }

  uploadFile(file, onProgress).then(onSuccess).catch(onError)
  return result
}

const beforeUpload = (file: File) => {
  const isRepeat = fileList.value.some((item) => item.file?.name === file.name)
  if (isRepeat) {
    Message.error('文件名重复')
    return false
  }
  if (file.size > 10 * 1024 * 1024) {
    Message.error('文件大小超过10MB')
    return false
  }
  emit('finish', false)
  return true
}

const onSuccess = (fileItem: FileItem) => {
  let isFinished = true
  for (const item of fileList.value) {
    if (item.uid !== fileItem.uid && item.status !== 'done') {
      isFinished = false
      break
    }
  }
  if (isFinished) {
    const otherFileIds = fileList.value
      .filter((item) => item.uid !== fileItem.uid)
      .map((item) => (item.response as UploadFileResponse)?.data.id)

    const allFileIds = new Set([...otherFileIds, fileItem.response?.data.id])

    emit('finish', isFinished, Array.from(allFileIds))
    return
  }
}

const beforeRemove = async (fileItem: FileItem) => {
  if (fileList.value.length === 1 && fileList.value[0].uid === fileItem.uid) {
    emit('finish', false)
    return true
  }

  let isFinished = true
  for (const item of fileList.value) {
    if (item.uid !== fileItem.uid && item.status !== 'done') {
      isFinished = false
      break
    }
  }
  if (isFinished) {
    emit(
      'finish',
      isFinished,
      fileList.value
        .filter((item) => item.uid !== fileItem.uid)
        .map((item) => (item.response as UploadFileResponse)?.data.id),
    )
  }

  return true
}
</script>

<template>
  <a-upload
    v-model:fileList="fileList"
    draggable
    action="/"
    accept=".txt,.markdown,.md,.pdf,.html,.htm,.xlsx,.xls,.doc,.docx,.ppt,.pptx,.csv,.xml"
    tip="支持PDF、TXT、HTML、DOC、EXCEL、PPT、MD、CSV、XML，最多可上传10个文件，每个文件不超过10MB"
    multiple
    :show-cancel-button="false"
    :limit="10"
    :custom-request="uploadFiles"
    @before-upload="beforeUpload"
    @success="onSuccess"
    @before-remove="beforeRemove"
  />
</template>

<style scoped></style>
