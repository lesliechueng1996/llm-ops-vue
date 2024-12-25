<script setup lang="ts">
import { format } from 'date-fns'

const { description, createdAt, updatedAt } = defineProps<{
  description: string
  createdAt: number
  updatedAt?: number
}>()

const timeLabel = updatedAt ? '更新时间' : '发布时间'
const time = format(new Date(updatedAt || createdAt), 'MM-dd hh:mm')
</script>

<template>
  <div
    class="w-96 h-48 rounded-lg border border-gray-300 p-4 flex flex-col gap-3 bg-white cursor-pointer hover:shadow-md hover:scale-105 transition-all"
  >
    <div class="shrink-0">
      <slot name="header" />
    </div>
    <p class="text-sm text-gray-500 leading-5 line-clamp-4 grow">
      {{ description }}
    </p>
    <div class="flex items-center gap-1 shrink-0">
      <a-avatar class="w-4 h-4 bg-blue-700">
        <icon-user />
      </a-avatar>
      <p class="text-gray-500 text-xs">Leslie · {{ timeLabel }} {{ time }}</p>
    </div>
  </div>
</template>

<style scoped></style>
