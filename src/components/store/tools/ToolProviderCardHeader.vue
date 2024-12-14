<script setup lang="ts">
import { type GetBuiltinToolsResponse } from '@/models/builtin-tool'
import { API_PREFIX } from '@/config'

defineProps<{
  provider: GetBuiltinToolsResponse['data'][0]
}>()
</script>

<template>
  <div class="flex items-center gap-3">
    <a-avatar
      class="w-10 h-10"
      shape="square"
      :imageUrl="`${API_PREFIX}/builtin-tools/${provider.name}/icon`"
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
