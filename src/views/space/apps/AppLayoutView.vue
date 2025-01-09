<script setup lang="ts">
import { useRoute } from 'vue-router'
import { publishApp, cancelPublishApp } from '@/services/app-service'
import { onMounted, ref } from 'vue'
import { format } from 'date-fns'
import { Message, Modal } from '@arco-design/web-vue'
import PublishHistoryDrawer from '@/components/space/app/PublishHistoryDrawer.vue'
import { useCurrentAppStore } from '@/stores/current-app'

const route = useRoute()

const appId = route.params.appId as string

const currentAppStore = useCurrentAppStore()

onMounted(async () => {
  await currentAppStore.loadCurrentApp(appId)
})

const publishLoading = ref(false)
const publish = async () => {
  try {
    publishLoading.value = true
    await publishApp(appId as string)
    Message.success('发布成功')
    await currentAppStore.loadCurrentApp(appId)
  } catch {
    Message.error('发布失败')
  } finally {
    publishLoading.value = false
  }
}

const cancelPublish = () => {
  Modal.warning({
    title: '要取消发布该Agent应用吗？',
    content:
      '取消发布后，WebApp以及发布的社交平台均无法使用该Agent，如需更新WebApp地址，请使用地址重新生成功能',
    okText: '确定',
    cancelText: '取消',
    hideCancel: false,
    async onOk() {
      try {
        await cancelPublishApp(appId as string)
        Message.success('取消发布成功')
        await currentAppStore.loadCurrentApp(appId)
      } catch {
        Message.error('取消发布失败')
      }
    },
  })
}

const publishHistoryDrawerVisible = ref(false)
</script>

<template>
  <div class="w-screen h-screen flex flex-col">
    <header class="w-full h-[74px] bg-gray-100 shrink-0 flex items-center py-5 px-4">
      <div class="flex items-center gap-3 w-0 grow shrink-0">
        <router-link to="/space/apps" class="size-6">
          <icon-left size="24" />
        </router-link>
        <!-- <div class="size-8 bg-gradient-to-b rounded-sm from-[#C2E9FB] to-[#A1C4FD]"></div> -->
        <a-avatar class="size-8" shape="square">
          <img alt="avatar" :src="currentAppStore.currentApp?.icon" />
        </a-avatar>
        <div>
          <div class="flex items-center gap-1">
            <h1 class="text-sm font-medium text-gray-800">
              {{ currentAppStore.currentApp?.name }}
            </h1>
            <icon-edit size="14" class="text-gray-500" />
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-0.5 text-xs text-gray-500">
              <icon-user size="12" />
              <span>个人空间</span>
            </div>
            <div class="flex items-center gap-0.5 text-xs text-gray-500">
              <icon-clock-circle size="12" />
              <span>{{
                currentAppStore.currentApp?.status === 'published' ? '已发布' : '草稿'
              }}</span>
            </div>
            <a-tag
              class="bg-gray-200 rounded-md text-xs text-gray-500"
              v-if="currentAppStore.currentApp?.draft_updated_at"
            >
              已自动保存
              {{
                format(new Date(currentAppStore.currentApp?.draft_updated_at * 1000), 'HH:mm:ss')
              }}
            </a-tag>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3 w-0 grow shrink-0 justify-center text-lg text-gray-500">
        <router-link :to="`/space/apps/${appId}/detail`" active-class="text-blue-700 font-black"
          >编排</router-link
        >
        <router-link :to="`/space/apps/${appId}/published`" active-class="text-blue-700 font-black"
          >发布配置</router-link
        >
        <router-link :to="`/space/apps/${appId}/analysis`" active-class="text-blue-700 font-black"
          >统计分析</router-link
        >
      </div>
      <div class="flex justify-end items-center gap-3 w-0 grow shrink-0">
        <a-button type="secondary" class="rounded-lg" @click="publishHistoryDrawerVisible = true">
          <template #icon>
            <icon-clock-circle size="16" />
          </template>
        </a-button>
        <a-dropdown-button
          type="primary"
          :button-props="{
            type: 'primary',
            loading: publishLoading,
            class: 'rounded-lg font-bold',
          }"
          @click="publish"
          class="rounded-lg overflow-hidden"
        >
          <template #icon>
            <icon-down />
          </template>
          更新发布
          <template #content>
            <a-doption
              :disabled="currentAppStore.currentApp?.status !== 'published'"
              class="text-red-500"
              @click="cancelPublish"
              >取消发布</a-doption
            >
          </template>
        </a-dropdown-button>
      </div>
    </header>
    <router-view />
  </div>
  <publish-history-drawer
    v-if="currentAppStore.currentApp"
    v-model:visible="publishHistoryDrawerVisible"
    :app="currentAppStore.currentApp"
    @fallbacked="currentAppStore.loadCurrentApp"
  />
</template>

<style scoped></style>
