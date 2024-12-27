<script setup lang="ts">
type Props = {
  label: string
  title: string
  tags: string[]
  backUrl: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center justify-start gap-3 shrink-0">
    <router-link :to="backUrl">
      <icon-left size="16" />
    </router-link>
    <slot name="icon" />
    <div class="flex flex-col justify-center">
      <a-breadcrumb>
        <a-breadcrumb-item>{{ label }}</a-breadcrumb-item>
        <a-breadcrumb-item>{{ title }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="space-x-2">
        <a-tag
          class="bg-gray-200 text-gray-500 text-xs rounded-lg"
          v-for="tag in tags"
          :key="tag"
          >{{ tag }}</a-tag
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
