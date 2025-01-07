<script setup lang="ts">
defineProps<{
  language: string
  code: string
}>()
</script>

<template>
  <div class="rounded-lg overflow-hidden">
    <div class="py-2.5 px-4 bg-gray-500 text-sm text-white">
      {{ language }}
    </div>
    <highlightjs :language="language" :code="code" />
  </div>
</template>

<style scoped></style>
