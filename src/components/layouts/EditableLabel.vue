<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  value: string
  type: 'text' | 'password'
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'save', value: string): void
}>()

const isEditing = ref(false)
const inputValue = ref(props.type === 'text' ? props.value : '')

const handleSave = () => {
  isEditing.value = false
  emit('save', inputValue.value)
}

const handleCancel = () => {
  isEditing.value = false
  inputValue.value = props.type === 'text' ? props.value : ''
}
</script>

<template>
  <div class="w-full">
    <div v-if="!isEditing" class="flex items-center gap-2">
      <p class="text-sm text-gray-500">{{ value }}</p>
      <icon-edit @click="isEditing = true" class="cursor-pointer" />
    </div>
    <div v-else class="flex items-center gap-4 w-full">
      <a-input v-if="type === 'text'" v-model="inputValue" :placeholder="placeholder" />
      <a-input-password v-else v-model="inputValue" :placeholder="placeholder" />
      <a-button type="outline" class="rounded-lg" @click="handleCancel">取消</a-button>
      <a-button type="primary" class="rounded-lg" @click="handleSave">保存</a-button>
    </div>
  </div>
</template>

<style scoped></style>
