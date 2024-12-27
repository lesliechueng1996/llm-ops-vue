<script setup lang="ts">
import { ref } from 'vue'

export type ProcessType = 'automatic' | 'custom'

const processType = ref<ProcessType>('automatic')

export type CustomProcessRule = {
  separator: string[]
  chunkSize: number
  chunkOverlap: number
  removeExtraSpace: boolean
  removeUrlAndEmail: boolean
}

const customProcessRule = ref<CustomProcessRule>({
  separator: ['\\n'],
  chunkSize: 500,
  chunkOverlap: 50,
  removeExtraSpace: false,
  removeUrlAndEmail: false,
})

const emit = defineEmits<{
  (e: 'finish', isFinished: boolean, type: ProcessType, rule?: CustomProcessRule): void
}>()

const validateAll = () => {
  const { separator, chunkSize, chunkOverlap } = customProcessRule.value

  if (
    separator.length === 0 ||
    !chunkSize ||
    chunkSize < 100 ||
    chunkSize > 1000 ||
    !Number.isInteger(chunkSize) ||
    chunkOverlap === undefined ||
    chunkOverlap === null ||
    chunkOverlap < 0 ||
    chunkOverlap > 100 ||
    !Number.isInteger(chunkOverlap)
  ) {
    emit('finish', false, processType.value)
    return
  }

  emit('finish', true, processType.value, customProcessRule.value)
}

const handleSeparatorBlur = () => validateAll()
const handleChunkSizeBlur = () => validateAll()
const handleChunkOverlapBlur = () => validateAll()

const handleChangeProcessType = (type: ProcessType) => {
  processType.value = type
  if (type === 'automatic') {
    emit('finish', true, type)
    return
  }

  validateAll()
}
</script>

<template>
  <div class="space-y-4">
    <div
      :class="`w-full cursor-pointer px-5 py-4 border-2  rounded-lg space-y-2.5 ${processType === 'automatic' ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'}`"
      @click="handleChangeProcessType('automatic')"
    >
      <h2 class="font-bold text-gray-800 text-sm">自动分段与清洗</h2>
      <p class="text-gray-500 text-sm">自动分段与预处理规则</p>
    </div>
    <div
      :class="`w-full cursor-pointer px-5 py-4 border-2  rounded-lg space-y-2.5 bg-white ${processType === 'custom' ? 'border-blue-500' : ' border-gray-200'}`"
      @click="handleChangeProcessType('custom')"
    >
      <h2 class="font-bold text-gray-800 text-sm">自定义</h2>
      <p class="text-gray-500 text-sm">自定义分段规则、分段长度与预处理规则</p>
      <div v-show="processType === 'custom'">
        <a-divider />
        <a-form :model="customProcessRule" layout="vertical">
          <a-form-item label="分段标识符" field="separator" required validate-trigger="blur">
            <a-input-tag v-model="customProcessRule.separator" @blur="handleSeparatorBlur" />
          </a-form-item>
          <a-form-item label="分段最大长度" field="chunkSize" required validate-trigger="blur">
            <a-input-number
              v-model="customProcessRule.chunkSize"
              placeholder="请输入100-1000的数值"
              :min="100"
              :max="1000"
              :step="10"
              :formatter="(value: number | undefined) => `${value}`.replace(/[^\d]/g, '')"
              @blur="handleChunkSizeBlur"
            />
          </a-form-item>
          <a-form-item label="分段重叠长度" field="chunkOverlap" required validate-trigger="blur">
            <a-input-number
              placeholder="请输入0-100的数值"
              v-model="customProcessRule.chunkOverlap"
              :min="0"
              :max="100"
              :step="1"
              :formatter="(value: number | undefined) => `${value}`.replace(/[^\d]/g, '')"
              @blur="handleChunkOverlapBlur"
            />
          </a-form-item>
          <a-form-item label="文本预处理规则">
            <div class="flex flex-col gap-2">
              <a-checkbox v-model="customProcessRule.removeExtraSpace"
                >替换掉连续的空格、换行符和制表符</a-checkbox
              >
              <a-checkbox v-model="customProcessRule.removeUrlAndEmail"
                >删除所有 URL 和电子邮件地址</a-checkbox
              >
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
