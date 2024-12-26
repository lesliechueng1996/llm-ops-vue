<script setup lang="ts">
import { ref } from 'vue'
import RetrievalSettingModal from './RetrievalSettingModal.vue'
import { Message } from '@arco-design/web-vue'
import type { HitTestingStrategy } from '@/models/dataset-model'

const emit = defineEmits<{
  (
    e: 'test',
    params: {
      text: string
      strategy: HitTestingStrategy
      maxResults: number
      minScore: number
    },
  ): void
}>()

const text = ref('')
const showSettingModal = ref(false)

// 检索设置
const retrievalSettings = ref<{
  strategy: HitTestingStrategy
  maxResults: number
  minScore: number
}>({
  strategy: 'hybrid',
  maxResults: 5,
  minScore: 0.7,
})

const handleSettingConfirm = (settings: {
  strategy: HitTestingStrategy
  maxResults: number
  minScore: number
}) => {
  retrievalSettings.value = settings
}

const handleTest = () => {
  if (!text.value) {
    Message.error('请输入文本')
    return
  }
  emit('test', {
    text: text.value,
    ...retrievalSettings.value,
  })
}
</script>

<template>
  <div class="bg-blue-50 w-full h-full border-blue-500 border-2 rounded-lg flex flex-col">
    <div class="flex items-center justify-between px-4 py-2 shrink-0">
      <h2 class="font-bold text-gray-800">源文本</h2>
      <a-button type="outline" class="rounded-lg" @click="showSettingModal = true">
        <template #icon>
          <icon-language size="16" />
        </template>
        向量检索
      </a-button>
    </div>
    <div class="grow">
      <a-textarea
        class="w-full h-full rounded-t-lg bg-white hover:bg-white border-none"
        placeholder="请输入文本，建议使用简短的陈述句"
        v-model="text"
        :maxlength="200"
      />
    </div>
    <div class="flex items-center justify-between px-4 py-2 bg-white rounded-b-lg">
      <a-tag>{{ text.length }} / 200</a-tag>
      <a-button type="primary" class="rounded-lg font-bold text-white" @click="handleTest">
        测试
      </a-button>
    </div>

    <retrieval-setting-modal
      v-model:visible="showSettingModal"
      :default-settings="retrievalSettings"
      @confirm="handleSettingConfirm"
    />
  </div>
</template>

<style scoped>
:deep(.arco-textarea) {
  height: 100%;
  resize: none;
}
</style>
