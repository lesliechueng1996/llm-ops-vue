<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import ApiKeyModalForm, { type FormData } from './ApiKeyModalForm.vue'
import { updateApiKey } from '@/services/api-key-service'

const props = defineProps<{
  visible: boolean
  id: string
  isActive: boolean
  remark: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'refresh'): void
}>()

const handleSubmit = (data: FormData) => {
  updateApiKey(props.id, data.isActive, data.remark).then(() => {
    Message.success('编辑成功')
    emit('refresh')
  })
}
</script>

<template>
  <api-key-modal-form
    :visible="visible"
    title="编辑秘钥"
    :data="{ isActive, remark }"
    @submit="handleSubmit"
    @update:visible="emit('update:visible', $event)"
  />
</template>

<style scoped></style>
