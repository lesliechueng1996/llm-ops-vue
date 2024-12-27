<script setup lang="ts">
import HitTestingTextarea from './HitTestingTextarea.vue'
import { useHitTesting } from '@/hooks/use-hit-testing'
import type { HitTestingStrategy } from '@/models/dataset-model'
import RecentQuery from './RecentQuery.vue'
import { watch } from 'vue'
import HitCard from './HitCard.vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const { hit, recentQueries, loadRecentQueries, hitDocs } = useHitTesting()

const handleTest = (params: {
  text: string
  strategy: HitTestingStrategy
  maxResults: number
  minScore: number
}) => {
  hit(params.text, params.strategy, params.maxResults, params.minScore)
}

watch(
  () => props.visible,
  (value) => {
    if (value) {
      loadRecentQueries()
    }
  },
)
</script>

<template>
  <a-modal
    modal-class="rounded-lg w-[1000px]"
    :visible="visible"
    hide-title
    :footer="false"
    @cancel="emit('update:visible', false)"
    unmount-on-close
  >
    <!-- Header -->
    <div class="space-y-1">
      <div class="flex items-center justify-between">
        <h1 class="font-bold text-xl text-gray-800">召回测试</h1>
        <a-button class="!bg-transparent" @click="emit('update:visible', false)">
          <template #icon>
            <icon-close size="16" />
          </template>
        </a-button>
      </div>
      <p class="text-sm text-gray-500">基于给定的查询文本测试知识库的召回效果</p>
    </div>

    <!-- Body -->
    <div class="h-[650px] flex items-center py-6">
      <div class="grow w-0 shrink-0 h-full flex flex-col gap-8">
        <!-- 使用 flex-basis 和 min-height 确保元素平分高度且不被压缩 -->
        <hit-testing-textarea class="flex-[1_0_0%] min-h-[0%]" @test="handleTest" />
        <recent-query class="flex-[1_0_0%] min-h-[0%]" :recent-queries="recentQueries" />
      </div>
      <a-divider direction="vertical" class="h-full" />
      <div class="grow w-0 shrink-0 h-full overflow-y-scroll">
        <a-empty v-if="hitDocs.length === 0" />
        <a-grid v-else :cols="2" :col-gap="20" :row-gap="22">
          <a-grid-item v-for="hitDoc in hitDocs" :key="hitDoc.id">
            <hit-card :hit-doc="hitDoc" />
          </a-grid-item>
        </a-grid>
      </div>
    </div>
  </a-modal>
</template>

<style scoped></style>
