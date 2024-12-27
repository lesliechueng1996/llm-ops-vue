<script setup lang="ts">
import SegmentFormModal from './SegmentFormModal.vue'
import { onMounted, ref } from 'vue'
import { updateSegment, getSegment } from '@/services/segment-service'
import { useRoute } from 'vue-router'
import { type GetSegmentResponse } from '@/models/segment-model'

type Segment = GetSegmentResponse['data']

const loading = ref(false)
const route = useRoute()
const segment = ref<Segment | null>(null)

const props = defineProps<{
  visible: boolean
  id: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

onMounted(async () => {
  const res = await getSegment(
    route.params.datasetId as string,
    route.params.documentId as string,
    props.id,
  )
  segment.value = res.data
})

const handleSubmit = async (form: { content: string; keywords: string[] }) => {
  try {
    loading.value = true
    await updateSegment(
      route.params.datasetId as string,
      route.params.documentId as string,
      props.id,
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
      v-if="segment"
      :visible="visible"
      title="修改片段"
      :content="segment.content"
      :keywords="segment.keywords"
      @cancel="emit('cancel')"
      @submit="handleSubmit"
      :loading="loading"
    />
  </div>
</template>

<style scoped></style>
