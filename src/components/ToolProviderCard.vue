<script setup lang="ts">
import ToolProviderCardHeader, { type CardHeaderProvider } from './ToolProviderCardHeader.vue'
import CommonCard from './CommonCard.vue'

export type Provider = CardHeaderProvider & {
  description: string
  created_at: number
}

defineProps<{
  provider: Provider
}>()
</script>

<template>
  <common-card :description="provider.description" :created-at="provider.created_at">
    <template #header>
      <tool-provider-card-header :provider="provider" />
    </template>
  </common-card>
</template>

<style scoped></style>
