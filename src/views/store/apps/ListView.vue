<script setup lang="ts">
import type {
  GetAllBuiltinAppsResponse,
  GetBuiltinAppCategoriesResponse,
} from '@/models/builtin-app-model'
import { getBuiltinAppCategories, getAllBuiltinApps } from '@/services/builtin-app-service'
import { computed, onMounted, ref } from 'vue'
import BuiltinAppCard from '@/components/store/app/BuiltinAppCard.vue'
import CommonHeader from '@/components/CommonHeader.vue'

const categories = ref<GetBuiltinAppCategoriesResponse['data']>([])
const apps = ref<GetAllBuiltinAppsResponse['data']>([])
const selectedCategory = ref<string>('')
const isLoading = ref<boolean>(false)

const searchWord = ref<string>('')

const filteredApps = computed(() => {
  return apps.value.filter((app) => {
    return (
      (selectedCategory.value === '' || app.category === selectedCategory.value) &&
      (searchWord.value === '' || app.name.toLowerCase().includes(searchWord.value.toLowerCase()))
    )
  })
})

onMounted(async () => {
  try {
    isLoading.value = true
    const res = await Promise.all([getBuiltinAppCategories(), getAllBuiltinApps()])
    categories.value = [...res[0].data]
    apps.value = [...res[1].data]
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="h-screen px-6 flex flex-col">
    <!-- header -->
    <common-header class="shrink-0" title="应用广场" btn-text="">
      <template #icon>
        <icon-common />
      </template>
    </common-header>

    <!-- filter -->
    <div class="flex items-center justify-between mb-6 shrink-0">
      <div class="space-x-1">
        <a-button
          :type="selectedCategory === '' ? 'primary' : 'text'"
          class="rounded-lg"
          @click="selectedCategory = ''"
          >全部</a-button
        >
        <a-button
          v-for="category in categories"
          :key="category.category"
          :type="selectedCategory === category.category ? 'primary' : 'text'"
          class="rounded-lg"
          @click="selectedCategory = category.category"
          >{{ category.name }}</a-button
        >
      </div>
      <a-input
        class="w-52 rounded-lg bg-white border border-gray-200"
        placeholder="请输入应用名称"
        allow-clear
        v-model="searchWord"
      >
        <template #prefix>
          <icon-search />
        </template>
      </a-input>
    </div>

    <div class="grow overflow-y-scroll">
      <a-spin class="w-full h-full" :loading="isLoading" tip="加载中...">
        <!-- built-in tool provider list -->
        <div class="flex flex-wrap gap-5">
          <a-empty v-if="filteredApps.length === 0" />
          <builtin-app-card
            v-for="app in filteredApps"
            :key="app.id"
            :id="app.id"
            :icon="app.icon"
            :label="app.name"
            :provider="app.model_config.provider"
            :model="app.model_config.model"
            :created-at="app.created_at"
            :updated-at="0"
            :description="app.description"
          />
        </div>
      </a-spin>
    </div>
  </div>
</template>

<style scoped></style>
