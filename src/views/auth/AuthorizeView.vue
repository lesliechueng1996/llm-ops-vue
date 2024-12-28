<script setup lang="ts">
import { oauthAuthorize } from '@/services/oauth-service'
import { Message } from '@arco-design/web-vue'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCredentialStore } from '@/stores/credential'

const route = useRoute()
const router = useRouter()
const { update: updateCredential, clear: clearCredential } = useCredentialStore()

onMounted(async () => {
  try {
    const res = await oauthAuthorize(
      route.params.providerName as string,
      route.query.code as string,
    )
    updateCredential({
      access_token: res.data.access_token,
      expire_at: res.data.expire_at,
    })
    Message.success('授权登录成功')
    router.replace('/home')
  } catch {
    Message.error('授权登录失败')
    clearCredential()
    router.replace('/auth/login')
  }
})
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <a-spin tip="授权登录中..." />
  </div>
</template>

<style scoped></style>
