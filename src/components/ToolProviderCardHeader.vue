<script setup lang="ts">
import CommonCardHeader from './CommonCardHeader.vue'
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
  <common-card-header
    :label="provider.label"
    :icon="
      provider.icon?.startsWith('http')
        ? provider.icon
        : `${API_PREFIX}/builtin-tools/${provider.name}/icon`
    "
    :background="provider.background || '#fff'"
  >
    <template #name> 提供商 {{ provider.name }} · {{ provider.tools.length }} 插件 </template>
  </common-card-header>
</template>

<style scoped></style>
