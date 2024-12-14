<script setup lang="ts">
import { API_PREFIX } from '@/config'
import type { Tool } from './ToolCard.vue'

export type CardHeaderProvider = {
  name: string
  label: string
  background?: string
  tools: Tool[]
  icon?: string
}

defineProps<{
  provider: CardHeaderProvider
}>()
</script>

<template>
  <div class="flex items-center gap-3">
    <a-avatar
      class="w-10 h-10"
      shape="square"
      :imageUrl="
        provider.icon?.startsWith('http')
          ? provider.icon
          : `${API_PREFIX}/builtin-tools/${provider.name}/icon`
      "
      :style="{ backgroundColor: provider.background }"
    ></a-avatar>
    <div>
      <p class="text-gray-700 font-bold text-base">{{ provider.label }}</p>
      <p class="text-gray-500 text-xs">
        提供商 {{ provider.name }} · {{ provider.tools.length }} 插件
      </p>
    </div>
  </div>
</template>

<style scoped></style>
