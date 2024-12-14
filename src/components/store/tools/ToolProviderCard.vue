<script setup lang="ts">
import { type GetBuiltinToolsResponse } from '@/models/builtin-tool'
import { format } from 'date-fns'
import ToolProviderCardHeader from './ToolProviderCardHeader.vue'

defineProps<{
  provider: GetBuiltinToolsResponse['data'][0]
}>()
</script>

<template>
  <div
    class="w-96 h-48 rounded-lg border border-gray-300 p-4 flex flex-col gap-3 bg-white cursor-pointer hover:shadow-md hover:scale-105 transition-all"
  >
    <tool-provider-card-header class="shrink-0" :provider="provider" />
    <p class="text-sm text-gray-500 leading-5 line-clamp-4 grow">
      {{ provider.description }}
    </p>
    <div class="flex items-center gap-1 shrink-0">
      <a-avatar class="w-4 h-4 bg-blue-700">
        <icon-user />
      </a-avatar>
      <p class="text-gray-500 text-xs">
        Leslie · 发布时间 {{ format(new Date(provider.created_at), 'MM-dd hh:mm') }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
