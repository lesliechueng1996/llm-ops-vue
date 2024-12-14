<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <div class="flex gap-2">
    <div>
      <a-avatar :size="30" shape="circle">H</a-avatar>
    </div>
    <div class="space-y-2">
      <p class="text-black font-bold text-sm">慕小课</p>
      <p class="bg-blue-700 px-4 py-3 text-white rounded-2xl max-w-max">
        {{ content }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
