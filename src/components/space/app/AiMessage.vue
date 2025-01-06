<script setup lang="ts">
import { QueueEvent } from '@/models/app-model'
import { computed, ref } from 'vue'

const props = defineProps<{
  name: string
  icon: string
  content?: string
  thoughts: {
    id: string
    position: number
    event: QueueEvent
    thought: string
    observation: string
    latency: number
  }[]
  isLoading: boolean
  suggestedQuestions: string[]
}>()

const emit = defineEmits<{
  (e: 'click-question', question: string): void
}>()

const isThoughtsVisible = ref(false)

const onParentCollapseChange = (key: Array<string | number>) => {
  isThoughtsVisible.value = key.length > 0
}

const eventLabelMap: Partial<Record<QueueEvent, string>> = {
  [QueueEvent.AGENT_ACTION]: '调用工具',
  [QueueEvent.AGENT_THOUGHT]: '智能体推理',
  [QueueEvent.AGENT_MESSAGE]: '智能体消息',
  [QueueEvent.DATASET_RETRIEVAL]: '知识库检索',
  [QueueEvent.LONG_TERM_MEMORY_RECALL]: '长期记忆召回',
}

const showThoughtEvents = [QueueEvent.AGENT_THOUGHT, QueueEvent.AGENT_MESSAGE]

const showObservationEvents = [
  QueueEvent.DATASET_RETRIEVAL,
  QueueEvent.LONG_TERM_MEMORY_RECALL,
  QueueEvent.AGENT_ACTION,
]

const displayThoughts = computed(() => {
  const allowedEvents = [
    QueueEvent.AGENT_ACTION,
    QueueEvent.AGENT_THOUGHT,
    QueueEvent.AGENT_MESSAGE,
    QueueEvent.DATASET_RETRIEVAL,
    QueueEvent.LONG_TERM_MEMORY_RECALL,
  ]

  return props.thoughts
    .filter((thought) => allowedEvents.includes(thought.event))
    .sort((a, b) => a.position - b.position)
})
</script>

<template>
  <div class="flex gap-2 ai-message">
    <div>
      <a-avatar :size="30" shape="circle" :image-url="icon"></a-avatar>
    </div>
    <div class="space-y-2">
      <p class="text-black font-bold text-sm">{{ name }}</p>

      <a-collapse
        :active-key="isThoughtsVisible ? ['1'] : []"
        @change="onParentCollapseChange"
        class="rounded-lg max-w-80 min-w-72"
      >
        <a-collapse-item :header="`${isThoughtsVisible ? '隐藏' : '展开'}运行流程`" key="1">
          <template #expand-icon>
            <icon-list />
          </template>
          <template #extra>
            <icon-loading v-if="isLoading" />
          </template>
          <a-collapse class="sub-collapse" v-for="thought in displayThoughts" :key="thought.id">
            <a-collapse-item :header="eventLabelMap[thought.event]" :key="thought.id">
              <template #expand-icon>
                <icon-file v-if="thought.event === QueueEvent.LONG_TERM_MEMORY_RECALL" />
                <icon-storage v-else-if="thought.event === QueueEvent.DATASET_RETRIEVAL" />
                <icon-robot v-else-if="thought.event === QueueEvent.AGENT_THOUGHT" />
                <icon-public v-else-if="thought.event === QueueEvent.AGENT_ACTION" />
                <icon-language v-else-if="thought.event === QueueEvent.AGENT_MESSAGE" />
              </template>
              <template #extra>
                <span>{{ thought.latency.toFixed(2) }}s</span>
              </template>
              <div class="px-3 py-2">
                <p
                  class="line-clamp-4 break-all text-xs text-gray-500"
                  v-if="showThoughtEvents.includes(thought.event)"
                >
                  {{ thought.thought }}
                </p>
                <p
                  class="line-clamp-4 break-all text-xs text-gray-500"
                  v-else-if="showObservationEvents.includes(thought.event)"
                >
                  {{ thought.observation }}
                </p>
              </div>
            </a-collapse-item>
          </a-collapse>
        </a-collapse-item>
      </a-collapse>

      <p class="bg-gray-100 px-4 py-3 text-gray-900 rounded-2xl max-w-max break-all">
        <template v-if="!!content">{{ content }}</template>
        <template v-else>
          <icon-loading class="text-base" />
        </template>
      </p>

      <div class="space-y-3" v-if="suggestedQuestions.length > 0">
        <p
          class="p-3 border border-gray-200 w-fit bg-gray-100 rounded-lg text-sm text-gray-500 cursor-pointer"
          v-for="question in suggestedQuestions"
          :key="question"
          @click="emit('click-question', question)"
        >
          {{ question }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.ai-message .arco-collapse-item-content,
.ai-message .arco-collapse-item-content-box {
  padding: 0;
}

.ai-message .arco-collapse-item-header {
  background-color: rgb(243, 244, 246);
}

.ai-message .sub-collapse .arco-collapse-item-header {
  background-color: white;
}
</style>
