<script setup lang="ts">
import SegmentFormModal from './SegmentFormModal.vue'
import { ref } from 'vue'
import { createSegment } from '@/services/segment-service'
import { useRoute } from 'vue-router'

const loading = ref(false)
const route = useRoute()

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const handleSubmit = async (form: { content: string; keywords: string[] }) => {
  try {
    loading.value = true
    await createSegment(
      route.params.datasetId as string,
      route.params.documentId as string,
      form.content,
      form.keywords,
    )
    emit('cancel')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <segment-form-modal
      :visible="visible"
      title="创建片段"
      :content="''"
      :keywords="[]"
      @cancel="emit('cancel')"
      @submit="handleSubmit"
      :loading="loading"
    />
  </div>
</template>

<style scoped></style>
