<script setup lang="ts">
import { type GetBuiltinToolsResponse } from '@/models/builtin-tool'
import { format } from 'date-fns'
import { API_PREFIX } from '@/config'

defineProps<{
  provider: GetBuiltinToolsResponse['data'][0]
}>()
</script>

<template>
  <div
    class="w-96 h-48 rounded-lg border border-gray-300 p-4 flex flex-col gap-3 bg-white cursor-pointer hover:shadow-md hover:scale-105 transition-all"
  >
    <div class="flex items-center gap-3 shrink-0">
      <a-avatar
        class="w-10 h-10"
        shape="square"
        :imageUrl="`${API_PREFIX}/builtin-tools/${provider.name}/icon`"
        :style="{ backgroundColor: provider.background }"
      ></a-avatar>
      <div>
        <p class="text-gray-700 font-bold text-base">{{ provider.label }}</p>
        <p class="text-gray-500 text-xs">
          提供商 {{ provider.name }} · {{ provider.tools.length }} 插件
        </p>
      </div>
    </div>
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
