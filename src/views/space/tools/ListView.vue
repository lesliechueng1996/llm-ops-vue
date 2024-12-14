<script setup lang="ts">
import { getApiToolProvidersWithPage } from '@/services/api-tool'
import { onMounted, ref } from 'vue'
import ToolProviderCard, { type Provider } from '@/components/ToolProviderCard.vue'
import ToolProviderDrawer from '@/components/ToolProviderDrawer.vue'

const apiToolProviders = ref<Provider[]>([])
const isLoading = ref<boolean>(false)

const selectedProvider = ref<Provider | null>(null)

onMounted(async () => {
  try {
    isLoading.value = true
    const res = await getApiToolProvidersWithPage()
    apiToolProviders.value = res.data.list.map((provider) => ({
      ...provider,
      label: provider.name,
      tools: provider.tools.map((tool) => ({ ...tool, label: tool.name })),
    }))
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <a-spin class="w-full h-full" :loading="isLoading" tip="加载中...">
      <div class="flex flex-wrap gap-5">
        <a-empty v-if="apiToolProviders.length === 0" />
        <tool-provider-card
          v-for="provider in apiToolProviders"
          :key="provider.name"
          :provider="{
            ...provider,
            label: provider.name,
            tools: provider.tools.map((tool) => ({ ...tool, label: tool.name })),
          }"
          @click="selectedProvider = provider"
        />
      </div>
    </a-spin>

    <tool-provider-drawer :selectedProvider="selectedProvider" @cancel="selectedProvider = null" />
  </div>
</template>

<style scoped></style>
