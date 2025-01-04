<script setup lang="ts">
import { ref } from 'vue'
import { useDraftConfigStore } from '@/stores/draft-config'
import LongTermMemoryModal from './LongTermMemoryModal.vue'
import ChatBot from './ChatBot.vue'

const isLongTermMemoryModalVisible = ref(false)

const draftConfigStore = useDraftConfigStore()
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
    <div class="w-full flex-1 flex flex-col min-h-0">
      <chat-bot />
    </div>
  </div>

  <long-term-memory-modal v-model:visible="isLongTermMemoryModalVisible" />
</template>

<style scoped></style>
