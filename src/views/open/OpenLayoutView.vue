<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="px-6 flex flex-col h-screen">
    <header class="py-7 flex items-center shrink-0">
      <div class="flex items-center justify-center size-8 mr-2 rounded-full bg-blue-700 text-white">
        <icon-user :size="16" />
      </div>
      <h1 class="text-xl font-medium mr-3">开放API</h1>
      <p class="text-sm text-gray-500">利用开放 API 快速与企业现有业务对接</p>
    </header>
    <nav class="flex items-center gap-1 mb-6 shrink-0">
      <router-link
        to="/open"
        :class="route.path === '/open' ? 'bg-gray-200 rounded-lg' : 'text-sm text-gray-700'"
      >
        <p class="px-3.5 py-1.5">快速开始</p>
      </router-link>
      <router-link
        to="/open/api-key"
        :class="route.path === '/open/api-key' ? 'bg-gray-200 rounded-lg' : 'text-sm text-gray-700'"
      >
        <p class="px-3.5 py-1.5">密钥</p>
      </router-link>
    </nav>
    <main class="min-h-0 flex-1">
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
