<script setup lang="ts">
defineProps<{
  title: string
  btnText: string
}>()
</script>

<template>
  <header class="flex items-center justify-between py-6">
    <div class="flex gap-2 items-center">
      <a-avatar class="w-8 h-8 bg-blue-700 p-2">
        <slot name="icon" />
      </a-avatar>
      <p class="text-gray-700 text-xl font-medium">{{ title }}</p>
    </div>
    <a-button v-if="btnText !== ''" type="primary" class="rounded-lg">{{ btnText }}</a-button>
  </header>
</template>

<style scoped></style>
