<script setup lang="ts">
import CommonHeader from '@/components/CommonHeader.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

const pathTipMap: Record<string, string> = {
  '/space/apps': 'AI应用',
  '/space/tools': '插件',
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

const searchWord = ref('')
const router = useRouter()

const commitSearch = (event: FocusEvent | KeyboardEvent) => {
  const target = event.target as HTMLInputElement
  target.blur()
  router.push({ query: { search: searchWord.value } })
}

onMounted(() => {
  const search = route.query.search
  if (search) {
    searchWord.value = search as string
  }
})
</script>

<template>
  <div class="h-screen px-6 flex flex-col">
    <!-- header -->
    <common-header
      class="shrink-0"
      title="个人空间"
      :btn-text="`创建自定义${tipText}`"
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
      <a-input
        class="w-52 rounded-lg bg-white border border-gray-200"
        :placeholder="`请输入${tipText}名称`"
        allow-clear
        v-model="searchWord"
        @press-enter="commitSearch"
        @blur="commitSearch"
      >
        <template #prefix>
          <icon-search />
        </template>
      </a-input>
    </div>

    <router-view :create-type="createType" @cancel-modal="clearCreateType" />
  </div>
</template>

<style scoped></style>
