<script setup lang="ts">
import { useDraftConfigStore } from '@/stores/draft-config'
import { Message } from '@arco-design/web-vue'
import { ref } from 'vue'
import { optimizePrompt } from '@/services/ai-service'

const draftConfigStore = useDraftConfigStore()

const handleBlur = async () => {
  await draftConfigStore.savePresetPrompt()
  Message.success('保存成功')
}

const handleOptimize = async () => {
  optimizeResult.value = ''

  try {
    optimizeLoading.value = true
    showOptimizeResult.value = true
    const res = optimizePrompt(prompt.value)
    for await (const event of res) {
      optimizeResult.value += event.data.optimize_prompt
    }
  } finally {
    optimizeLoading.value = false
  }
}

const prompt = ref('')
const optimizeLoading = ref(false)
const optimizeResult = ref('')
const showOptimizeResult = ref(false)

const handleReplace = async () => {
  draftConfigStore.presetPrompt = optimizeResult.value
  await draftConfigStore.savePresetPrompt()
  showOptimizeResult.value = false
  prompt.value = ''
  optimizeResult.value = ''
  Message.success('替换成功')
}

const handleExit = () => {
  showOptimizeResult.value = false
  prompt.value = ''
  optimizeResult.value = ''
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="px-6 py-2.5 flex justify-between items-center shrink-0">
      <h2 class="text-sm font-bold text-gray-800">人设与回复逻辑</h2>
      <a-trigger trigger="click" :unmount-on-close="false" position="bl" :popup-offset="10">
        <a-button type="text" class="rounded-lg" size="small">
          <template #icon>
            <icon-refresh />
          </template>
          <template #default>优化</template>
        </a-button>
        <template #content>
          <div class="bg-white rounded-lg p-4 w-96 flex flex-col gap-3">
            <div v-if="showOptimizeResult" class="flex flex-col justify-start gap-2">
              <a-textarea
                readonly
                class="w-full !bg-transparent"
                v-model="optimizeResult"
                :auto-size="{
                  minRows: 2,
                  maxRows: 12,
                }"
              />
              <div class="space-x-2">
                <a-button
                  class="rounded-lg"
                  type="primary"
                  size="small"
                  :loading="optimizeLoading"
                  @click="handleReplace"
                  >替换</a-button
                >
                <a-button
                  class="rounded-lg"
                  type="secondary"
                  size="small"
                  :loading="optimizeLoading"
                  @click="handleExit"
                  >退出</a-button
                >
              </div>
            </div>
            <a-input
              class="w-full rounded-full"
              placeholder="你希望如何编写或优化提示词"
              v-model="prompt"
            >
              <template #suffix>
                <icon-send
                  v-if="!optimizeLoading"
                  class="text-blue-500 -rotate-45 cursor-pointer"
                  @click="handleOptimize"
                />
                <icon-loading v-else class="text-blue-500 -rotate-45" />
              </template>
            </a-input>
          </div>
        </template>
      </a-trigger>
    </div>
    <div class="flex-1 px-3">
      <a-textarea
        class="h-full resize-none !bg-transparent border-none text-gray-700"
        placeholder="请在这里输入Agent的人设与回复逻辑(预设prompt)"
        :max-rows="2000"
        v-model="draftConfigStore.presetPrompt"
        @blur="handleBlur"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.arco-textarea) {
  height: 100%;
  resize: none;
}
</style>
