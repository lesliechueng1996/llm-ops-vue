<script setup lang="ts">
import CommonCard from '@/components/CommonCard.vue'
import CommonCardHeader from '@/components/CommonCardHeader.vue'

export type Props = {
  id: string
  icon: string
  label: string
  provider: string
  model: string
  description: string
  updatedAt: number
  createdAt: number
  href?: string
}

defineProps<Props>()
</script>

<template>
  <common-card :description="description" :created-at="createdAt" :updated-at="updatedAt">
    <template #header>
      <common-card-header :label="label" :icon="icon" :href="href">
        <template #name>
          <p>{{ provider }} · {{ model }}</p>
        </template>
        <template #badge>
          <slot name="badge" />
        </template>
        <template #operation>
          <slot name="operation" />
        </template>
      </common-card-header>
    </template>
  </common-card>
</template>

<style scoped></style>
