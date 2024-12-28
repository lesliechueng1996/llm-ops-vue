<script setup lang="ts">
import SideBar from '@/components/layouts/SideBar.vue'
import { onMounted } from 'vue'
import { getCurrentUser } from '@/services/account-service'
import { useAccountStore } from '@/stores/account'

const accountStore = useAccountStore()

onMounted(async () => {
  const response = await getCurrentUser()
  accountStore.update(response.data)
})
</script>

<template>
  <a-layout class="bg-gray-50">
    <a-layout-sider class="h-screen border-none shadow-none p-2 bg-gray-50" :width="240">
      <side-bar />
    </a-layout-sider>
    <a-layout-content>
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<style scoped></style>
