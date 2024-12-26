<script setup lang="ts">
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { renameDocument } from '@/services/document-service'

interface Props {
  documentId: string
  datasetId: string
  originalName: string
}

interface Emits {
  (e: 'success'): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const documentName = ref(props.originalName)
const loading = ref(false)

const handleOk = async () => {
  const newName = documentName.value.trim()

  if (!newName) {
    Message.warning('请输入文档名称')
    return
  }

  if (newName === props.originalName) {
    Message.warning('新文件名与原文件名相同')
    return
  }

  try {
    loading.value = true
    await renameDocument(props.datasetId, props.documentId, newName)
    Message.success('重命名成功')
    emit('success')
    documentName.value = ''
  } catch {
    Message.error('重命名失败')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  documentName.value = ''
  emit('close')
}

const rules = {
  documentName: [{ required: true, message: '请输入文档名称' }],
}
</script>

<template>
  <a-modal
    :visible="!!documentId"
    @cancel="handleCancel"
    @close="handleCancel"
    @ok="handleOk"
    :ok-loading="loading"
    :unmount-on-close="true"
    title="重命名"
    title-align="start"
  >
    <a-form :model="{ documentName }" :rules="rules" layout="vertical">
      <a-form-item field="documentName" label="名称" validate-trigger="blur">
        <a-input
          v-model="documentName"
          placeholder="请输入新文档名，文档名不影响数据检索"
          allow-clear
          :max-length="30"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
