<script setup lang="ts">
import LongTermMemory from './ability/LongTermMemory.vue'
import OpeningStatement from './ability/OpeningStatement.vue'
</script>

<template>
  <div class="py-3">
    <h2 class="px-5 text-sm font-bold text-gray-700 mb-2">应用能力</h2>
    <a-collapse :bordered="false" class="px-2">
      <long-term-memory />
      <opening-statement />
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
