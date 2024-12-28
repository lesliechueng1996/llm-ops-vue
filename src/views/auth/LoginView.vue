<script setup lang="ts">
import bannerImg from '@/assets/images/login-banner.png'
import { Message, type FormInstance } from '@arco-design/web-vue'
import { reactive, ref } from 'vue'
import { passwordLogin } from '@/services/auth-service'
import { useCredentialStore } from '@/stores/credential'
import { useRouter } from 'vue-router'
import { getOAuthRedirectUrl } from '@/services/oauth-service'

const { update: updateCredential, clear: clearCredential } = useCredentialStore()
const router = useRouter()

const carousels = [
  {
    title: '开箱即用的高质量AI编排模版',
    subTitle: '丰富的应用组件、覆盖大多数典型业务场景',
    image: bannerImg,
  },
  {
    title: '零代码5分钟编排原生AI应用',
    subTitle: '高效开发你的AI原生应用',
    image: bannerImg,
  },
]

const form = reactive({
  email: '',
  password: '',
})

const formRef = ref<FormInstance>()
const loginBtnLoading = ref(false)
const githubBtnLoading = ref(false)

const handleLogin = async () => {
  if (!formRef.value) {
    return
  }

  try {
    loginBtnLoading.value = true
    const hasError = await formRef.value.validate()
    if (hasError) {
      return
    }

    const res = await passwordLogin(form)
    Message.success('登录成功')
    updateCredential({
      access_token: res.data.access_token,
      expire_at: res.data.expire_at,
    })

    router.push('/home')
  } catch {
    Message.error('登录失败')
    clearCredential()
  } finally {
    loginBtnLoading.value = false
  }
}

const handleGithubLogin = async () => {
  try {
    githubBtnLoading.value = true
    const res = await getOAuthRedirectUrl('github')
    window.location.href = res.data.redirect_url
  } catch {
    Message.error('获取Github授权地址失败')
  } finally {
    githubBtnLoading.value = false
  }
}
</script>

<template>
  <div class="w-screen h-screen flex">
    <div class="w-0 grow h-full bg-gradient-to-b from-[#1D2129] to-[#00308F]">
      <a-carousel class="h-full">
        <a-carousel-item v-for="item in carousels" :key="item.title">
          <div class="flex flex-col items-center justify-center h-full">
            <h1 class="text-white text-2xl font-bold text-center mb-2">{{ item.title }}</h1>
            <p class="text-gray-500 text-sm text-center mb-8">{{ item.subTitle }}</p>
            <img :src="item.image" alt="Banner" class="max-w-80 w-[80%]" />
          </div>
        </a-carousel-item>
      </a-carousel>
    </div>
    <div class="w-0 grow-[2] h-full flex items-center justify-center">
      <div class="w-80">
        <h1 class="text-2xl font-bold text-gray-800">登录 LLMOps AppBuilder</h1>
        <p class="text-gray-500 mb-8">高效开发你的AI原生应用</p>
        <a-form ref="formRef" :model="form" layout="vertical">
          <a-form-item
            label="邮箱"
            field="email"
            hide-label
            hide-asterisk
            :rules="[
              { required: true, message: '登录邮箱不可为空' },
              { type: 'email', message: '请输入正确的邮箱格式' },
              { max: 254, message: '邮箱长度不能超过254个字符' },
            ]"
            :validate-trigger="['change', 'blur']"
          >
            <a-input v-model="form.email" placeholder="登录邮箱" :max-length="254">
              <template #prefix>
                <icon-user />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item
            label="密码"
            field="password"
            hide-label
            hide-asterisk
            :rules="[
              { required: true, message: '登录密码不可为空' },
              { min: 8, message: '密码长度不能小于8个字符' },
              { max: 16, message: '密码长度不能超过16个字符' },
              { match: /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/, message: '密码必须包含字母和数字' },
            ]"
            :validate-trigger="['change', 'blur']"
          >
            <a-input-password v-model="form.password" placeholder="登录密码" :max-length="16">
              <template #prefix>
                <icon-lock />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleLogin" class="w-full" :loading="loginBtnLoading"
              >登录</a-button
            >
          </a-form-item>
        </a-form>
        <a-divider class="!mb-8" orientation="center">第三方授权</a-divider>
        <a-button
          type="dashed"
          class="w-full"
          :loading="githubBtnLoading"
          @click="handleGithubLogin"
        >
          <template #icon>
            <icon-github />
          </template>
          <template #default>Github</template>
        </a-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
