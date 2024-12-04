<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import ChatMessage from './ChatMessage.vue'
import { debugApp } from '@/services/app-service'
import AiMessage from './AiMessage.vue'

type Message = {
  role: 'human' | 'ai'
  content: string
}

const messages = ref<Message[]>([]) // 聊天消息列表
const query = ref<string>('') // 输入框内容
const isLoading = ref(false) // 是否正在加载
const route = useRoute()

const sendMessage = async () => {
  if (!query.value) {
    Message.error('请输入内容')
    return
  }

  if (isLoading.value) {
    Message.warning('正在加载，请稍后')
    return
  }

  const humanQuery = query.value
  query.value = ''
  messages.value.push({
    role: 'human',
    content: humanQuery,
  })

  try {
    isLoading.value = true
    const res = await debugApp(route.params.id as string, humanQuery)
    if (isLoading.value) {
      messages.value.push({
        role: 'ai',
        content: res.data.content,
      })
    }
  } finally {
    isLoading.value = false
  }
}

const clearMessages = () => {
  messages.value = []
  isLoading.value = false
}
</script>

<template>
  <div class="w-full h-full flex flex-col bg-white">
    <header
      class="w-full h-16 px-4 flex shrink-0 justify-between items-center border-b-[1px] border-gray-200"
    >
      <h1 class="text-xl text-gray-900">预览与调试</h1>
      <button class="p-1 text-blue-700 font-medium">
        <icon-save class="mr-[6px] text-base" />
        <span>长期记忆</span>
      </button>
    </header>
    <section class="flex-1 overflow-y-scroll">
      <!-- empty chat message -->
      <div v-if="messages.length === 0" class="text-center pt-48 space-y-2">
        <a-avatar :size="70" shape="square">Arco</a-avatar>
        <p class="text-gray-900 text-3xl font-bold">ChatGPT聊天机器人</p>
      </div>

      <!-- chat messages -->
      <div v-else class="space-y-6 px-6 py-7">
        <chat-message
          v-for="(message, index) in messages"
          :key="index"
          :role="message.role"
          :content="message.content"
        />
        <!-- loading -->
        <ai-message v-if="isLoading" :is-loading="true" />
      </div>
    </section>
    <section class="py-4 shrink-0 space-y-3">
      <div class="px-9 flex items-center">
        <a-button class="mr-5 shrink-0" type="text" shape="circle" @click="clearMessages">
          <icon-brush class="text-base" />
        </a-button>
        <div
          class="h-12 pl-6 pr-5 flex items-center space-x-5 flex-1 rounded-3xl border border-gray-200"
        >
          <input
            class="flex-1 h-full outline-none text-sm"
            type="text"
            v-model="query"
            @keyup.enter="sendMessage"
          />
          <a-button class="mr-5 shrink-0" type="text" shape="circle">
            <icon-plus-circle class="text-base" />
          </a-button>
          <a-button
            class="mr-5 shrink-0"
            type="text"
            shape="circle"
            @click="sendMessage"
            :disabled="isLoading"
          >
            <icon-send class="text-base -rotate-45" />
          </a-button>
        </div>
      </div>
      <p class="text-center text-xs text-gray-500">内容由AI生成，无法确保真实准确，仅供参考。</p>
    </section>
  </div>
</template>

<style scoped></style>
