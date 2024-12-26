<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps<{
  visible: boolean
  position: number
  content: string
  keywords: string[]
}>()

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
}>()

const formData = reactive({
  content: props.content,
  keywords: props.keywords,
})

const rules = {
  content: [{ required: true, message: '请输入片段内容' }],
}
</script>

<template>
  <a-modal
    width="520px"
    hide-title
    :footer="false"
    modal-class="rounded-lg"
    :visible="visible"
    @cancel="emit('update:visible', false)"
    unmount-on-close
  >
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <h1 class="font-bold text-xl text-gray-800">片段详情</h1>
        <a-tag class="rounded-lg"># {{ position }}</a-tag>
      </div>
      <a-button class="!bg-transparent" @click="emit('update:visible', false)">
        <template #icon>
          <icon-close size="16" />
        </template>
      </a-button>
    </div>
    <!-- form -->
    <a-form :model="formData" :rules="rules" layout="vertical">
      <a-form-item field="content" label="片段内容" validate-trigger="blur">
        <a-textarea
          class="rounded-lg h-52"
          v-model="formData.content"
          placeholder="请输入片段内容"
          readonly
        />
      </a-form-item>

      <a-form-item field="keywords" label="关键词">
        <a-input-tag v-model="formData.keywords" readonly placeholder="请输入关键词" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
:deep(.arco-textarea) {
  height: 100%;
  resize: none;
}
</style>
