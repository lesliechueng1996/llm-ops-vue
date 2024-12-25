<script setup lang="ts">
import CommonHeader from '@/components/CommonHeader.vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import SearchInput from '@/components/SearchInput.vue'

const route = useRoute()

const pathTipMap: Record<string, string> = {
  '/space/apps': 'AI应用',
  '/space/tools': '自定义插件',
  '/space/workflows': '工作流',
  '/space/datasets': '知识库',
}

const createType = ref<string | null>(null)
const clearCreateType = () => {
  createType.value = null
}
const handleHeaderBtnClick = () => {
  createType.value = tipText.value
}

const tipText = computed(() => {
  const path = route.path
  return pathTipMap[path] || ''
})
</script>

<template>
  <div class="h-screen px-6 flex flex-col">
    <!-- header -->
    <common-header
      class="shrink-0"
      title="个人空间"
      :btn-text="`创建${tipText}`"
      @click-btn="handleHeaderBtnClick"
    >
      <template #icon>
        <icon-user />
      </template>
    </common-header>

    <!-- nav -->
    <div class="flex items-center justify-between mb-6 shrink-0">
      <div class="space-x-1">
        <router-link
          v-for="path in Object.keys(pathTipMap)"
          :key="path"
          class="px-4 py-1.5"
          :to="path"
          active-class="bg-gray-200 rounded-lg"
          >{{ pathTipMap[path] }}</router-link
        >
      </div>
      <search-input :placeholder="`请输入${tipText}名称`" />
    </div>

    <router-view :create-type="createType" @cancel-modal="clearCreateType" />
  </div>
</template>

<style scoped></style>
