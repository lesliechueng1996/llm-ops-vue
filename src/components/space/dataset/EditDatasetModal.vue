<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DatasetModal, { type FormData } from './DatasetModal.vue'
import { updateDataset, getDataset } from '@/services/dataset-service'

const { id } = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const initialData = ref<FormData | null>(null)

const handleSubmit = async (form: FormData) => {
  await updateDataset(id, {
    name: form.name,
    icon: form.icon,
    description: form.description,
  })

  emit('cancel')
}

onMounted(async () => {
  if (id !== null) {
    const dataset = await getDataset(id)
    initialData.value = {
      icon: dataset.data.icon,
      name: dataset.data.name,
      description: dataset.data.description,
    }
  }
})
</script>

<template>
  <dataset-modal
    v-if="initialData"
    title="更新知识库"
    :visible="initialData !== null"
    :initialData="initialData"
    @submit="handleSubmit"
    @cancel="emit('cancel')"
  />
</template>

<style scoped></style>
