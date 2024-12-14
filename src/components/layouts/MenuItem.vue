<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  text: string
  href: string
  icon: object
  activeIcon: object
}>()

const route = useRoute()
const isActive = computed(() => route.path.startsWith(props.href))
</script>

<template>
  <router-link :to="props.href">
    <div
      :class="`flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-all ${isActive ? 'bg-gray-100' : ''}`"
    >
      <component v-if="isActive" :is="props.activeIcon" class="w-4 h-4" />
      <component v-else :is="props.icon" class="w-4 h-4" />
      <p class="text-sm text-gray-700">{{ props.text }}</p>
    </div>
  </router-link>
</template>

<style scoped></style>
