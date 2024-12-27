<script setup lang="ts">
import { useCreateDocuments } from '@/hooks/use-create-documents'
import UploadFiles from '@/components/space/dataset/document/UploadFiles.vue'
import ProcessRule from '@/components/space/dataset/document/ProcessRule.vue'
import ServerProcess from '@/components/space/dataset/document/ServerProcess.vue'

const {
  datasetId,
  step,
  canNext,
  handleUploadFinish,
  handleProcessRuleFinish,
  handleClickNext,
  batchId,
} = useCreateDocuments()
</script>

<template>
  <div class="p-6 h-full flex flex-col">
    <div class="flex items-center gap-3 mb-6 shrink-0">
      <router-link
        :to="`/space/datasets/${datasetId}/documents`"
        class="flex items-center cursor-pointer"
      >
        <icon-left size="16" />
      </router-link>
      <h1 class="text-lg font-bold text-gray-800">添加文件</h1>
    </div>

    <div class="w-[576px] mx-auto mb-12 shrink-0">
      <a-steps :current="step">
        <a-step>上传</a-step>
        <a-step>分段设置</a-step>
        <a-step>数据处理</a-step>
      </a-steps>
    </div>

    <div class="grow px-12 mb-12">
      <!-- Step 1 -->
      <upload-files v-if="step === 1" @finish="handleUploadFinish" />
      <!-- Step 2 -->
      <process-rule v-if="step === 2" @finish="handleProcessRuleFinish" />
      <!-- Step 3 -->
      <server-process v-if="step === 3 && batchId" :batch-id="batchId" />
    </div>

    <!-- Bottom button -->
    <div class="flex justify-end shrink-0 gap-3" v-if="step !== 3">
      <a-button v-if="step !== 1" class="rounded-lg" type="secondary" @click="step--"
        >上一步</a-button
      >
      <a-button :disabled="!canNext" class="rounded-lg" type="primary" @click="handleClickNext"
        >下一步</a-button
      >
    </div>
    <div class="flex justify-end items-center shrink-0 gap-3" v-if="step === 3">
      <p class="text-sm text-gray-500">点击确认不影响数据处理，处理完毕后可进行引用</p>
      <router-link :to="`/space/datasets/${datasetId}/documents`">
        <a-button class="rounded-lg font-bold" type="primary">确定</a-button>
      </router-link>
    </div>
  </div>
</template>

<style scoped></style>
