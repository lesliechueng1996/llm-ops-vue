<script setup lang="ts">
import { getApiTool, updateApiTool, deleteApiTool } from '@/services/api-tool'
import ToolModal, { type FormData } from './ToolModal.vue'
import { onMounted, ref } from 'vue'

const { providerId } = defineProps<{
  providerId: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const initialData = ref<FormData | null>(null)

const handleSubmit = async (form: FormData) => {
  await updateApiTool(providerId, {
    name: form.name,
    icon: form.icon,
    description: form.description,
    openapi_schema: form.openapiSchema,
    headers: form.headers.map((header) => ({
      key: header.label,
      value: header.value,
    })),
  })

  emit('cancel')
}

onMounted(async () => {
  const provider = await getApiTool(providerId)
  initialData.value = {
    name: provider.data.name,
    icon: provider.data.icon,
    description: provider.data.description,
    openapiSchema: provider.data.openapi_schema,
    headers: provider.data.headers.map((header) => ({
      label: header.key,
      value: header.value,
    })),
  }
})

const handleDelete = async () => {
  await deleteApiTool(providerId)
  emit('cancel')
}
</script>

<template>
  <tool-modal
    v-if="initialData"
    :visible="initialData !== null"
    title="新建插件"
    :initialData="initialData"
    withDelete
    @submit="handleSubmit"
    @cancel="emit('cancel')"
    @deleteTool="handleDelete"
  />
</template>

<style scoped></style>
