<script setup lang="ts">
import { useDraftConfigStore } from '@/stores/draft-config'
import { Message } from '@arco-design/web-vue'

const draftConfigStore = useDraftConfigStore()

const handleOpeningStatementBlur = async () => {
  await draftConfigStore.saveOpeningStatement()
  Message.success('保存成功')
}

const handleOpeningQuestionBlur = async () => {
  await draftConfigStore.saveOpeningQuestions()
  Message.success('保存成功')
}

const handleRemoveOpeningQuestion = async (index: number) => {
  draftConfigStore.removeOpeningQuestion(index)
  await draftConfigStore.saveOpeningQuestions()
  Message.success('保存成功')
}
</script>

<template>
  <a-collapse-item header="对话开场白" key="opening-statement">
    <div class="mb-3">
      <h3 class="flex items-center gap-2 mb-2 text-xs text-gray-700">
        <span>开场白文案</span>
        <icon-info-circle size="16" />
      </h3>
      <a-textarea
        class="bg-white rounded-lg"
        v-model="draftConfigStore.openingStatement"
        placeholder="在此处填写 AI 应用的开场白"
        :auto-size="{ minRows: 3, maxRows: 4 }"
        @blur="handleOpeningStatementBlur"
      />
    </div>
    <div>
      <h3 class="flex items-center gap-2 mb-2 text-xs text-gray-700">
        <span>开场白预设问题</span>
        <icon-info-circle size="16" />
      </h3>
      <div class="space-y-2">
        <a-input
          class="bg-white rounded-lg"
          v-for="(_, index) in draftConfigStore.openingQuestions"
          :key="index"
          v-model="draftConfigStore.openingQuestions[index]"
          placeholder="输入开场白引导问题"
          @blur="handleOpeningQuestionBlur"
        >
          <template #append>
            <icon-minus
              size="16"
              class="text-gray-500 cursor-pointer"
              @click.stop="handleRemoveOpeningQuestion(index)"
            />
          </template>
        </a-input>
      </div>
    </div>
    <template #extra>
      <icon-plus
        class="text-gray-500 cursor-pointer"
        v-if="draftConfigStore.openingQuestions.length < 3"
        size="16"
        @click.stop="draftConfigStore.addOpeningQuestion"
      />
    </template>
  </a-collapse-item>
</template>

<style scoped>
:deep(.arco-input-wrapper) {
  background-color: #fff;
  border-radius: 8px;
}

:deep(.arco-input-append) {
  background-color: #fff;
}
</style>
