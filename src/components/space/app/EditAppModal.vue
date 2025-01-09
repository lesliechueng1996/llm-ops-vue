<script setup lang="ts">
import { ref } from 'vue'
import AppFormModal, { type FormData } from './AppFormModal.vue'
import { updateAppInfo } from '@/services/app-service'

const props = defineProps<{
  id: string
  icon: string
  name: string
  description: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const initialData = ref<FormData | null>({
  icon: props.icon,
  name: props.name,
  description: props.description,
})

const handleSubmit = async (form: FormData) => {
  await updateAppInfo(
    {
      name: form.name,
      icon: form.icon,
      description: form.description,
    },
    props.id,
  )

  emit('cancel')
}
</script>

<template>
  <app-form-modal
    v-if="initialData"
    title="编辑应用"
    :visible="initialData !== null"
    :initialData="initialData"
    @submit="handleSubmit"
    @cancel="emit('cancel')"
  />
</template>

<style scoped></style>
