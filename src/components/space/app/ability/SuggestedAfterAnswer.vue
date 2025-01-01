<script setup lang="ts">
import { useDraftConfigStore } from '@/stores/draft-config'

const draftConfigStore = useDraftConfigStore()
</script>

<template>
  <a-collapse-item header="用户问题建议" key="suggested-after-answer">
    <p class="text-xs text-gray-500">在应用回复后，自动根据对话内容提供 3 条用户提问建议。</p>

    <template #extra>
      <a-select
        class="w-20 rounded-lg bg-transparent border border-gray-200"
        :trigger-props="{ autoFitPopupMinWidth: true }"
        @click.stop
        v-model="draftConfigStore.isSuggestedAfterAnswerEnabled"
      >
        <a-option :value="true">开启</a-option>
        <a-option :value="false">关闭</a-option>
      </a-select>
    </template>
  </a-collapse-item>
</template>

<style scoped></style>
