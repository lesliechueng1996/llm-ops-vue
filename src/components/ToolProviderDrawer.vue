<script setup lang="ts">
import ToolProviderCardHeader, {
  type CardHeaderProvider,
} from '@/components/ToolProviderCardHeader.vue'
import ToolCard from './ToolCard.vue'

type Provider = CardHeaderProvider & {
  description: string
}

defineProps<{
  selectedProvider: Provider | null
}>()
const emit = defineEmits<{
  (e: 'cancel'): void
}>()
</script>

<template>
  <a-drawer
    :width="394"
    :visible="selectedProvider !== null"
    @cancel="emit('cancel')"
    :footer="false"
  >
    <template #title>{{ selectedProvider?.label }}</template>

    <div class="px-3 py-2" v-if="selectedProvider !== null">
      <tool-provider-card-header :provider="selectedProvider" class="mb-3" />
      <p class="text-sm text-gray-500 leading-5 mb-3">
        {{ selectedProvider.description }}
      </p>
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
