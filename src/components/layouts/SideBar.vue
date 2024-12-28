<script setup lang="ts">
import MenuItem from './MenuItem.vue'
import IconHome from './icons/IconHome.vue'
import IconHomeFull from './icons/IconHomeFull.vue'
import IconSpace from './icons/IconSpace.vue'
import IconSpaceFull from './icons/IconSpaceFull.vue'
import IconApp from './icons/IconApp.vue'
import IconAppFull from './icons/IconAppFull.vue'
import IconTool from './icons/IconTool.vue'
import IconToolFull from './icons/IconToolFull.vue'
import IconOpenApi from './icons/IconOpenApi.vue'
import IconOpenApiFull from './icons/IconOpenApiFull.vue'
// import { logout } from '@/services/auth-service'
import { useRouter } from 'vue-router'
import { useCredentialStore } from '@/stores/credential'

const { clear: clearCredential } = useCredentialStore()
const router = useRouter()
const menuItems = [
  { text: '首页', href: '/home', icon: IconHome, activeIcon: IconHomeFull },
  { text: '个人空间', href: '/space/apps', icon: IconSpace, activeIcon: IconSpaceFull },
]
const discoverItems = [
  { text: '应用广场', href: '/store/apps', icon: IconApp, activeIcon: IconAppFull },
  { text: '插件广场', href: '/store/tools', icon: IconTool, activeIcon: IconToolFull },
  { text: '开放API', href: '/open', icon: IconOpenApi, activeIcon: IconOpenApiFull },
]

const handleSelect = async (value: unknown) => {
  if (value === 'logout') {
    // await logout()
    clearCredential()
    router.replace('/auth/login')
  }
}
</script>

<template>
  <aside class="h-full bg-white px-2 py-4 rounded-lg max-w-56 flex flex-col justify-between">
    <div>
      <!-- LOGO -->
      <router-link to="/home">
        <div class="w-28 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all mb-5" />
      </router-link>

      <a-button type="primary" long class="rounded-lg mb-4">
        <template #icon>
          <icon-plus />
        </template>
        创建 AI 应用
      </a-button>

      <!-- Menu -->
      <div class="flex flex-col gap-2">
        <menu-item
          v-for="item in menuItems"
          :key="item.href"
          :text="item.text"
          :href="item.href"
          :icon="item.icon"
          :active-icon="item.activeIcon"
        />
        <p class="text-sm text-gray-500 pl-2">探索</p>
        <menu-item
          v-for="item in discoverItems"
          :key="item.href"
          :text="item.text"
          :href="item.href"
          :icon="item.icon"
          :active-icon="item.activeIcon"
        />
      </div>
    </div>
    <div class="p-2">
      <a-dropdown position="tl" trigger="hover" @select="handleSelect">
        <div class="flex items-center justify-start gap-2 cursor-pointer">
          <a-avatar class="bg-blue-700 w-8 h-8">A</a-avatar>
          <div>
            <p class="text-sm text-gray-900">Leslie</p>
            <p class="text-xs text-gray-500">xxxxxx@163.com</p>
          </div>
        </div>
        <template #content>
          <a-doption value="setting">账号设置</a-doption>
          <a-doption value="logout" class="text-red-800 hover:!text-red-900">退出登录</a-doption>
        </template>
      </a-dropdown>
    </div>
  </aside>
</template>

<style scoped></style>
