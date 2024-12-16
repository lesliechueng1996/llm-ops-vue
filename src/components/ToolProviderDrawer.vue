<script setup lang="ts">
import ToolProviderCardHeader, {
  type CardHeaderProvider,
} from '@/components/ToolProviderCardHeader.vue'
import ToolCard from './ToolCard.vue'

export type Provider = CardHeaderProvider & {
  id: string
  description: string
  created_at: number
}

const { selectedProvider, canEdit = false } = defineProps<{
  selectedProvider: Provider | null
  canEdit?: boolean
}>()
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'edit', id: string): void
}>()
</script>

<template>
  <a-drawer
    :width="394"
    :visible="selectedProvider !== null"
    @cancel="emit('cancel')"
    :footer="false"
  >
    <template #title>工具详情</template>

    <div class="px-3 py-2" v-if="selectedProvider !== null">
      <tool-provider-card-header :provider="selectedProvider" class="mb-3" />
      <p class="text-sm text-gray-500 leading-5 mb-3">
        {{ selectedProvider.description }}
      </p>

      <a-button
        v-if="canEdit"
        class="w-full rounded-lg mb-3"
        type="outline"
        @click="emit('edit', selectedProvider.id)"
        ><icon-settings /> 编辑</a-button
      >

      <a-divider margin="0" />

      <p class="text-sm text-gray-500 pt-6 mb-3">包含 {{ selectedProvider.tools.length }} 个工具</p>
      <tool-card
        v-for="tool in selectedProvider.tools"
        :key="tool.name"
        :tool="tool"
        class="mb-2"
      />
    </div>
  </a-drawer>
</template>

<style scoped></style>
