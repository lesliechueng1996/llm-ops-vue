<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import ChatMessage from './ChatMessage.vue'
import { debugAppStream } from '@/services/app-service'
import { useDraftConfigStore } from '@/stores/draft-config'
import LongTermMemoryModal from './LongTermMemoryModal.vue'
import { useCurrentAppStore } from '@/stores/current-app'
import { storeToRefs } from 'pinia'

type Message = {
  role: 'human' | 'ai'
  content: string
}

const { currentApp } = storeToRefs(useCurrentAppStore())
const { openingStatement, openingQuestions } = storeToRefs(useDraftConfigStore())

const messages = ref<Message[]>([]) // 聊天消息列表
const query = ref<string>('') // 输入框内容
const isLoading = ref(false) // 是否正在加载
const route = useRoute()
const messageWrap = useTemplateRef<HTMLDivElement>('messages-wrap')
const isLongTermMemoryModalVisible = ref(false)

const draftConfigStore = useDraftConfigStore()

const scrollMessageToBottom = () => {
  if (!messageWrap.value) {
    return
  }
  messageWrap.value.scrollTop = messageWrap.value.scrollHeight
}

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
    const res = debugAppStream(route.params.id as string, humanQuery)
    messages.value.push({
      role: 'ai',
      content: '',
    })

    for await (const { event, data } of res) {
      if (isLoading.value) {
        const lastMessage = messages.value[messages.value.length - 1]

        if (event === 'agent_message') {
          messages.value[messages.value.length - 1].content = lastMessage.content + data.answer
        }
      }
    }
  } finally {
    isLoading.value = false
  }
}

const clearMessages = () => {
  messages.value = []
  isLoading.value = false
}

watch([messages, isLoading], scrollMessageToBottom, {
  deep: true,
  flush: 'post',
})
</script>

<template>
  <div class="w-full h-full flex flex-col bg-white">
    <header
      class="w-full h-16 px-4 flex shrink-0 justify-between items-center border-b-[1px] border-gray-200"
    >
      <h1 class="text-xl text-gray-900">预览与调试</h1>
      <a-button
        v-if="draftConfigStore.isLongTermMemoryEnabled"
        type="text"
        class="rounded-lg"
        @click="isLongTermMemoryModalVisible = true"
      >
        <template #icon>
          <icon-save size="16" />
        </template>
        <template #default>长期记忆</template>
      </a-button>
    </header>
    <section class="flex-1 overflow-y-scroll" ref="messages-wrap">
      <!-- empty chat message -->
      <div v-if="messages.length === 0" class="text-center pt-48 space-y-2">
        <a-avatar :size="70" shape="square">
          <img :src="currentApp?.icon" alt="app-icon" />
        </a-avatar>
        <p class="text-gray-900 text-3xl font-bold">
          {{ currentApp?.name }}
        </p>
        <p
          v-if="openingStatement?.trim()"
          class="text-gray-500 text-sm bg-gray-50 rounded-lg px-4 py-3 w-fit mx-auto max-w-[80%] text-start"
        >
          {{ openingStatement }}
        </p>
        <div v-if="openingQuestions?.length" class="flex max-w-[80%] mx-auto flex-wrap gap-2">
          <div v-for="question in openingQuestions" :key="question">
            <p
              v-if="question.trim()"
              class="text-gray-500 text-sm bg-white rounded-lg px-3 py-2 border border-gray-200"
            >
              {{ question }}
            </p>
          </div>
        </div>
      </div>

      <!-- chat messages -->
      <div v-else class="space-y-6 px-6 py-7">
        <chat-message
          v-for="message in messages"
          :key="message.content"
          :role="message.role"
          :content="message.content"
        />
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

  <long-term-memory-modal v-model:visible="isLongTermMemoryModalVisible" />
</template>

<style scoped></style>
