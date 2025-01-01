<script setup lang="ts">
import { useDraftConfigStore } from '@/stores/draft-config'
import { Message } from '@arco-design/web-vue'
import { computed, reactive, ref, watch } from 'vue'

const draftConfigStore = useDraftConfigStore()

const isReviewConfigModalVisible = ref(false)

const initFormData = () => {
  reviewConfigForm.keywords = (draftConfigStore.reviewConfig?.keywords ?? []).join('\n')
  reviewConfigForm.inputEnable = draftConfigStore.reviewConfig?.inputs_config?.enable ?? false
  reviewConfigForm.inputPresetResponse =
    draftConfigStore.reviewConfig?.inputs_config?.preset_response ?? ''
  reviewConfigForm.outputEnable = draftConfigStore.reviewConfig?.outputs_config?.enable ?? false
}

const reviewConfigForm = reactive({
  keywords: '',
  inputEnable: false,
  inputPresetResponse: '',
  outputEnable: false,
})

watch(isReviewConfigModalVisible, (newVal) => {
  if (newVal) {
    initFormData()
  }
})

const keywordCount = computed(() => {
  return reviewConfigForm.keywords.split('\n').filter(Boolean).length
})

const handleReviewConfigOk = async () => {
  draftConfigStore.reviewConfig = {
    enable: draftConfigStore.isReviewConfigEnabled,
    keywords: reviewConfigForm.keywords.split('\n').filter(Boolean),
    inputs_config: {
      enable: reviewConfigForm.inputEnable,
      preset_response: reviewConfigForm.inputPresetResponse,
    },
    outputs_config: {
      enable: reviewConfigForm.outputEnable,
    },
  }
  await draftConfigStore.saveReviewConfig()
  Message.success('保存成功')
}
</script>

<template>
  <a-collapse-item header="内容审核" key="review-config">
    <p v-if="!draftConfigStore.isReviewConfigEnabled" class="text-xs text-gray-500">
      对用户输入以及大语言模型输出进行内容审查
    </p>
    <a-button class="w-full rounded-lg" v-else @click="isReviewConfigModalVisible = true">
      <template #icon>
        <icon-settings size="16" />
      </template>
      <template #default>设置</template>
    </a-button>

    <template #extra>
      <a-select
        class="w-20 rounded-lg bg-transparent border border-gray-200"
        :trigger-props="{ autoFitPopupMinWidth: true }"
        @click.stop
        v-model="draftConfigStore.isReviewConfigEnabled"
      >
        <a-option :value="true">开启</a-option>
        <a-option :value="false">关闭</a-option>
      </a-select>
    </template>
  </a-collapse-item>

  <a-modal
    v-model:visible="isReviewConfigModalVisible"
    title="内容审核"
    title-align="start"
    @ok="handleReviewConfigOk"
  >
    <a-form :model="reviewConfigForm" layout="vertical">
      <a-form-item label="关键词" required asterisk-position="end">
        <template #extra>
          <p>每行一个，用换行符分割。最多填写100个关键词</p>
        </template>
        <div class="relative w-full">
          <a-textarea
            v-model="reviewConfigForm.keywords"
            class="rounded-lg bg-white border border-gray-200 pb-5"
            :auto-size="{ minRows: 4, maxRows: 4 }"
          />
          <p class="text-xs text-gray-500 absolute bottom-3 right-3 z-50">
            {{ keywordCount }} / 100
          </p>
        </div>
      </a-form-item>
      <div class="w-full bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 mb-5">
        <div
          :class="`flex items-center justify-between ${reviewConfigForm.inputEnable ? 'mb-2' : ''}`"
        >
          <h3 class="text-sm text-gray-700">输入审核内容</h3>
          <a-switch type="round" v-model="reviewConfigForm.inputEnable" size="small" />
        </div>
        <div class="flex flex-col gap-1" v-if="reviewConfigForm.inputEnable">
          <h4 class="text-xs text-gray-500">预设回复</h4>
          <a-textarea
            v-model="reviewConfigForm.inputPresetResponse"
            class="rounded-lg bg-white border border-gray-200"
            :auto-size="{ minRows: 3, maxRows: 3 }"
          />
        </div>
      </div>
      <div class="w-full bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-sm text-gray-700">输出审核内容</h3>
          <a-switch type="round" v-model="reviewConfigForm.outputEnable" size="small" />
        </div>
      </div>
    </a-form>
  </a-modal>
</template>

<style scoped></style>
