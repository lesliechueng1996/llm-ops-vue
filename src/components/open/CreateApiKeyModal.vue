<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import ApiKeyModalForm, { type FormData } from './ApiKeyModalForm.vue'
import { createApiKey } from '@/services/api-key-service'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'refresh'): void
}>()

const handleSubmit = (data: FormData) => {
  createApiKey(data.isActive, data.remark).then(() => {
    Message.success('创建成功')
    emit('refresh')
  })
}
</script>

<template>
  <api-key-modal-form
    :visible="visible"
    title="新增秘钥"
    :data="{ isActive: true, remark: '' }"
    @submit="handleSubmit"
    @update:visible="emit('update:visible', $event)"
  />
</template>

<style scoped></style>
