<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppFormModal, { type FormData } from './AppFormModal.vue'
import { createApp } from '@/services/app-service'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const router = useRouter()

const handleSubmit = async (form: FormData) => {
  const res = await createApp({
    name: form.name,
    icon: form.icon,
    description: form.description,
  })

  const id = res.data.id
  router.push(`/space/apps/${id}/detail`)

  emit('cancel')
}
</script>

<template>
  <app-form-modal
    title="创建应用"
    :visible="visible"
    :initialData="{
      icon: '',
      name: '',
      description: '',
    }"
    @submit="handleSubmit"
    @cancel="emit('cancel')"
  />
</template>

<style scoped></style>
