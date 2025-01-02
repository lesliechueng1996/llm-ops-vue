<script setup lang="ts">
import LongTermMemory from './ability/LongTermMemory.vue'
import OpeningStatement from './ability/OpeningStatement.vue'
import SuggestedAfterAnswer from './ability/SuggestedAfterAnswer.vue'
import ReviewConfig from './ability/ReviewConfig.vue'
import DatasetReference from './ability/DatasetReference.vue'
</script>

<template>
  <div class="py-3 h-full flex flex-col">
    <h2 class="px-5 text-sm font-bold text-gray-700 mb-2 shrink-0">应用能力</h2>
    <a-collapse :bordered="false" class="px-2 min-h-0 flex-1 overflow-y-scroll">
      <dataset-reference />
      <long-term-memory />
      <opening-statement />
      <suggested-after-answer />
      <review-config />
    </a-collapse>
  </div>
</template>

<style scoped>
:deep(.arco-collapse-item-content) {
  background-color: #f9fafb;
  padding: 0 16px;
}

:deep(.arco-collapse-item-header) {
  border: none;
  background-color: #f9fafb;
}
</style>
