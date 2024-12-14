<script setup lang="ts">
import { type GetBuiltinToolsResponse } from '@/models/builtin-tool'
import { ref } from 'vue'

type Tool = GetBuiltinToolsResponse['data'][0]['tools'][0]

defineProps<{
  tool: Tool
}>()

const isParamsVisible = ref(false)
</script>

<template>
  <div
    class="w-full rounded-xl border border-gray-300 px-4 py-3 hover:shadow-md hover:scale-105 transition-all cursor-pointer"
    @click="isParamsVisible = !isParamsVisible"
  >
    <h2 class="font-bold text-gray-700 mb-2">{{ tool.label }}</h2>
    <p class="text-xs">{{ tool.description }}</p>

    <div v-show="isParamsVisible" class="pt-2">
      <div class="flex items-center gap-1 mb-2">
        <span class="font-bold text-xs text-gray-500 leading-3">参数</span>
        <div class="border-b border-b-gray-300 grow"></div>
      </div>
      <div v-for="input in tool.inputs" :key="input.name" class="text-xs space-y-1">
        <div class="space-x-2">
          <span class="font-bold text-gray-700">{{ input.name }}</span>
          <span class="text-gray-500">{{ input.type }}</span>
          <span v-if="input.required" class="text-red-700">必填</span>
        </div>
        <p>{{ input.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
