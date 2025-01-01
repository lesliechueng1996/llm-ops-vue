<script setup lang="ts">
import { useDraftConfigStore } from '@/stores/draft-config'

const draftConfigStore = useDraftConfigStore()
</script>

<template>
  <a-collapse-item header="长期记忆" key="long-term-memory">
    <p class="text-xs text-gray-500">总结聊天对话的内容，并用于更好的响应用户的消息。</p>

    <template #extra>
      <a-select
        class="w-20 rounded-lg bg-transparent border border-gray-200"
        :trigger-props="{ autoFitPopupMinWidth: true }"
        @click.stop
        v-model="draftConfigStore.isLongTermMemoryEnabled"
      >
        <a-option :value="true">开启</a-option>
        <a-option :value="false">关闭</a-option>
      </a-select>
    </template>
  </a-collapse-item>
</template>

<style scoped></style>
