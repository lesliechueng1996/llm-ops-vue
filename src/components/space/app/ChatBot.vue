<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCurrentAppStore } from '@/stores/current-app'
import { useDraftConfigStore } from '@/stores/draft-config'
import { useChatBot } from '@/hooks/use-chat-bot'
import { useAccountStore } from '@/stores/account'
import HumanMessage from './HumanMessage.vue'
import AiMessage from './AiMessage.vue'
import { nextTick, onMounted, useTemplateRef } from 'vue'

interface RecycleScroller {
  scrollToBottom: () => void
  $el: HTMLElement
}

const { currentApp } = storeToRefs(useCurrentAppStore())
const { openingStatement, openingQuestions } = storeToRefs(useDraftConfigStore())
const { account } = storeToRefs(useAccountStore())

const scroller = useTemplateRef<RecycleScroller>('scroller')
const { messages, query, isLoading, loadMessages, isMessagesLoading, sendMessage } =
  useChatBot(scroller)

onMounted(async () => {
  await loadMessages(true)
  await nextTick(() => {
    scrollMessageToBottom()
  })
})

const handleScroll = async (event: UIEvent) => {
  const { scrollTop } = event.target as HTMLElement
  if (scrollTop <= 0 && !isMessagesLoading.value) {
    saveScrollHeight()
    await loadMessages(false)
    restoreScrollHeight()
  }
}

let scrollHeight = 0

const saveScrollHeight = () => {
  const el = scroller.value?.$el as HTMLElement
  scrollHeight = el?.scrollHeight ?? 0
}

const restoreScrollHeight = () => {
  if (!scroller.value?.$el) {
    return
  }
  const el = scroller.value.$el as HTMLElement
  el.scrollTop = el.scrollHeight - scrollHeight
}

const scrollMessageToBottom = () => {
  scroller.value?.scrollToBottom()
}

// const clearMessages = () => {
//   messages.value = []
//   isLoading.value = false
// }

// watch([messages, isLoading], scrollMessageToBottom, {
//   deep: true,
//   flush: 'post',
// })
</script>

<template>
  <section class="flex-1 min-h-0" ref="messages-wrap">
    <!-- empty chat message -->
    <div v-if="!messages || messages.length === 0" class="text-center pt-48 space-y-2">
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
    <dynamic-scroller
      v-show="messages && messages.length > 0"
      ref="scroller"
      :items="messages"
      class="px-6 h-full overflow-y-scroll"
      :min-item-size="1"
      @scroll="handleScroll"
    >
      <template v-slot="{ item, index, active }">
        <dynamic-scroller-item :item="item" :data-index="item.id" :active="active">
          <div class="space-y-6 py-3">
            <human-message :name="account.name" :icon="account.avatar" :content="item.query" />
            <ai-message
              :name="currentApp?.name ?? ''"
              :icon="currentApp?.icon ?? ''"
              :content="item.answer"
              :thoughts="item.agentThoughts"
              :is-loading="isLoading && index === messages.length - 1"
            />
          </div>
        </dynamic-scroller-item>
      </template>
    </dynamic-scroller>
  </section>

  <section class="py-4 shrink-0 space-y-3">
    <div class="px-9 flex items-center">
      <a-button class="mr-5 shrink-0" type="text" shape="circle">
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
          :disabled="isLoading"
          @click="sendMessage"
        >
          <icon-send class="text-base -rotate-45" />
        </a-button>
      </div>
    </div>
    <p class="text-center text-xs text-gray-500">内容由AI生成，无法确保真实准确，仅供参考。</p>
  </section>
</template>

<style scoped></style>
