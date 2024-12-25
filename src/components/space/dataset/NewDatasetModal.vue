<script setup lang="ts">
import DatasetModal, { type FormData } from './DatasetModal.vue'
import { createDataset } from '@/services/dataset-service'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const handleSubmit = async (form: FormData) => {
  await createDataset({
    name: form.name,
    icon: 'https://picsum.photos/200/200',
    description: form.description,
  })

  emit('cancel')
}
</script>

<template>
  <dataset-modal
    title="创建知识库"
    :visible="visible"
    :initialData="{
      icon: '',
      name: '',
      description: '',
    }"
    @submit="handleSubmit"
  />
</template>

<style scoped></style>
