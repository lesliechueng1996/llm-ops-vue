<script setup lang="ts">
import { type GetSegmentPaginationResponse } from '@/models/segment-model'
type Segment = GetSegmentPaginationResponse['data']['list'][number]

defineProps<{
  segment: Segment
}>()
</script>

<template>
  <div class="p-4 rounded-lg bg-white border border-gray-200 w-72 space-y-2">
    <div class="flex items-center justify-between">
      <a-tag class="rounded-lg text-xs text-gray-500"># {{ segment.position }}</a-tag>
      <div class="flex items-center">
        <div class="flex items-center gap-1">
          <p class="text-sm text-gray-500">{{ segment.enabled ? '已启用' : '已禁用' }}</p>
          <div
            :class="`size-2 ${segment.enabled ? 'bg-green-500' : 'bg-gray-300'} rounded-[3px]`"
          ></div>
        </div>
        <a-divider direction="vertical" />
        <div>
          <a-switch type="round" :default-checked="segment.enabled" size="small" />
        </div>
      </div>
    </div>
    <p class="text-sm text-gray-700 line-clamp-5">{{ segment.content }}</p>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1">
          <icon-file size="12" />
          <p class="text-xs text-gray-500">{{ segment.character_count }} 字符</p>
        </div>
        <div class="flex items-center gap-1">
          <icon-send size="12" class="-rotate-45" />
          <p class="text-xs text-gray-500">{{ segment.hit_count }} 命中</p>
        </div>
      </div>
      <div>
        <a-button type="secondary">
          <template #icon>
            <icon-delete size="12" />
          </template>
        </a-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
