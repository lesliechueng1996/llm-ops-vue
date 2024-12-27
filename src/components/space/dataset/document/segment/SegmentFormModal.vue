<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { reactive } from 'vue'

const props = defineProps<{
  visible: boolean
  title: string
  content: string
  keywords: string[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (
    e: 'submit',
    form: {
      content: string
      keywords: string[]
    },
  ): void
}>()

const formData = reactive({
  content: props.content,
  keywords: props.keywords,
})

const rules = {
  content: [{ required: true, message: '请输入片段内容' }],
}

const handleOk = async () => {
  if (formData.content.trim() === '') {
    Message.error('请输入片段内容')
    return
  }

  if (formData.keywords.length > 10) {
    Message.error('关键词不能超过10个')
    return
  }

  emit('submit', formData)
}
</script>

<template>
  <a-modal
    width="520px"
    hide-title
    modal-class="rounded-lg"
    :visible="visible"
    @cancel="emit('cancel')"
    @ok="handleOk"
    :ok-loading="loading"
    unmount-on-close
  >
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <h1 class="font-bold text-xl text-gray-800">{{ title }}</h1>
      </div>
      <a-button class="!bg-transparent" @click="emit('cancel')">
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
        />
      </a-form-item>

      <a-form-item field="keywords" label="关键词">
        <a-input-tag v-model="formData.keywords" placeholder="请输入关键词" allow-clear />
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
