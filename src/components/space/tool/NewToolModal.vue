<script setup lang="ts">
import { createApiTools } from '@/services/api-tool'
import ToolModal, { type FormData } from './ToolModal.vue'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const initialData = {
  name: '',
  description: '',
  openapiSchema: '',
  headers: [
    {
      label: '',
      value: '',
    },
  ],
}

const handleSubmit = async (form: FormData) => {
  await createApiTools({
    name: form.name,
    icon: 'https://cn.vuejs.org/viteconf.svg',
    description: form.description,
    openapi_schema: form.openapiSchema,
    headers: form.headers.map((header) => ({
      key: header.label,
      value: header.value,
    })),
  })

  emit('cancel')
}
</script>

<template>
  <tool-modal
    :visible="visible"
    title="新建插件"
    :initialData="initialData"
    @submit="handleSubmit"
    @cancel="emit('cancel')"
  />
</template>

<style scoped></style>
