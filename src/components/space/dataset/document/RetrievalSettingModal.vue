<script setup lang="ts">
import { ref } from 'vue'
import type { HitTestingStrategy } from '@/models/dataset-model'

const props = defineProps<{
  visible: boolean
  defaultSettings: {
    strategy: HitTestingStrategy
    maxResults: number
    minScore: number
  }
}>()

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (
    e: 'confirm',
    settings: {
      strategy: HitTestingStrategy
      maxResults: number
      minScore: number
    },
  ): void
}>()

// 表单数据，使用 props 的默认值初始化
const strategy = ref(props.defaultSettings.strategy)
const maxResults = ref(props.defaultSettings.maxResults)
const minScore = ref(props.defaultSettings.minScore)

// 检索策略选项
const strategyOptions = [
  { label: '混合检索', value: 'hybrid' },
  { label: '向量检索', value: 'semantic' },
  { label: '全文检索', value: 'full_text' },
]

const handleCancel = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  emit('confirm', {
    strategy: strategy.value,
    maxResults: maxResults.value,
    minScore: minScore.value,
  })
  emit('update:visible', false)
}
</script>

<template>
  <a-modal
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleConfirm"
    :unmount-on-close="true"
    title="检索设置"
    title-align="start"
  >
    <div class="space-y-6">
      <!-- 检索策略 -->
      <div class="flex items-center">
        <div class="text-gray-600 w-24">检索策略</div>
        <a-radio-group v-model="strategy">
          <a-radio v-for="option in strategyOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </a-radio>
        </a-radio-group>
      </div>

      <!-- 最大召回数量 -->
      <div class="flex items-center">
        <div class="text-gray-600 w-24">最大召回数量</div>
        <div class="flex items-center gap-4 flex-1">
          <a-slider v-model="maxResults" :min="1" :max="10" class="flex-1" />
          <a-input-number
            v-model="maxResults"
            :min="1"
            :max="10"
            :style="{ width: '100px' }"
            hide-button
          />
        </div>
      </div>

      <!-- 最小匹配度 -->
      <div class="flex items-center">
        <div class="text-gray-600 w-24">最小匹配度</div>
        <div class="flex items-center gap-4 flex-1">
          <a-slider v-model="minScore" :min="0" :max="0.99" :step="0.01" class="flex-1" />
          <a-input-number
            v-model="minScore"
            :min="0"
            :max="0.99"
            :step="0.01"
            :precision="2"
            :style="{ width: '100px' }"
            hide-button
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleConfirm">确定</a-button>
      </div>
    </template>
  </a-modal>
</template>
