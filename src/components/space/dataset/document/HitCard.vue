<script setup lang="ts">
import type { HitTestingResponse } from '@/models/dataset-model'
import HitCardDetailModal from './HitCardDetailModal.vue'
import { ref } from 'vue'

type HitDoc = HitTestingResponse['data'][0]

defineProps<{
  hitDoc: HitDoc
}>()

const visible = ref(false)
</script>

<template>
  <div
    class="w-56 rounded-lg bg-gray-50 px-4 py-5 cursor-pointer hover:shadow-lg"
    @click="visible = true"
  >
    <div class="flex items-center justify-between gap-1 mb-3">
      <icon-send size="14" class="-rotate-45" />
      <a-progress :percent="hitDoc.score" :show-text="false" color="#CCCCCC" size="medium" />
      <p class="text-xs font-bold text-gray-500">{{ hitDoc.score.toFixed(2) }}</p>
    </div>
    <p class="text-sm mb-1.5 text-gray-700 line-clamp-4">{{ hitDoc.content }}</p>
    <div class="w-full h-[1px] bg-gray-300 mb-2" />
    <div class="flex items-center gap-1">
      <icon-file size="16" />
      <p class="text-xs text-gray-500 truncate">{{ hitDoc.document.name }}</p>
    </div>
  </div>
  <hit-card-detail-modal
    :position="hitDoc.position"
    :content="hitDoc.content"
    :keywords="hitDoc.keywords"
    :visible="visible"
    @update:visible="visible = $event"
  />
</template>

<style scoped></style>
