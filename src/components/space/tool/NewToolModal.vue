<script setup lang="ts">
import { reactive, ref } from 'vue'

defineProps<{
  visible: boolean
}>()

defineEmits<{
  cancel: () => void
}>()

const form = reactive<{
  name: string
  description: string
  openapiSchema: string
  headers: { label: string; value: string }[]
}>({
  name: '',
  description: '',
  openapiSchema: '',
  headers: [
    {
      label: '',
      value: '',
    },
  ],
})

const toolColumns = [
  {
    title: '名称',
    dataIndex: 'operationId',
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '方法',
    dataIndex: 'method',
  },
  {
    title: '路径',
    dataIndex: 'path',
  },
]

const availableTools = ref<
  {
    description: string
    operationId: string
    method: string
    path: string
  }[]
>([])

const headerColumns = [
  {
    title: 'Key',
    dataIndex: 'key',
    slotName: 'key',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    slotName: 'value',
  },
  {
    title: '操作',
    slotName: 'optional',
  },
]
// const headerDatas = ref<{ key: string; value: string }[]>([
//   {
//     key: '',
//     value: '',
//   },
// ])
</script>

<template>
  <a-modal :visible="visible" @cancel="$emit('cancel')">
    <template #title> 新建插件 </template>
    <div class="max-h-96 overflow-y-scroll">
      <a-form :model="form" layout="vertical">
        <a-form-item field="icon">
          <a-upload
            class="flex !justify-center w-full"
            list-type="picture-card"
            action="/"
            image-preview
          />
        </a-form-item>
        <a-form-item field="name" label="插件名称" required>
          <a-input
            v-model="form.name"
            placeholder="请输入插件名称，请确保名称含义清晰"
            show-word-limit
            :max-length="60"
          />
        </a-form-item>
        <a-form-item field="description" label="插件描述" required>
          <a-textarea
            v-model="form.description"
            placeholder="请输入插件描述"
            show-word-limit
            :max-length="200"
            :auto-size="{
              minRows: 2,
              maxRows: 5,
            }"
          />
        </a-form-item>
        <a-form-item field="openapiSchema" label="OpenAPI Schema" required>
          <a-textarea
            v-model="form.openapiSchema"
            placeholder="在此处输入您的 OpenAPI Schema"
            show-word-limit
            :max-length="600"
            :auto-size="{
              minRows: 2,
              maxRows: 5,
            }"
          />
        </a-form-item>
        <a-form-item label="可用工具">
          <a-table class="w-full" :columns="toolColumns" :data="availableTools" :pagination="false">
            <template #empty>
              <div></div>
            </template>
          </a-table>
        </a-form-item>
        <a-form-item label="Headers">
          <a-table class="w-full" :columns="headerColumns" :data="form.headers" :pagination="false">
            <template #empty>
              <div></div>
            </template>
            <template #key="{ rowIndex }">
              <!-- <a-form-item :field="`form.headers[${rowIndex}].label`" :key="rowIndex">
                <a-input v-model="form.headers[rowIndex].label" placeholder="请输入请求头键名" />
              </a-form-item> -->
              <a-input
                :name="`form.headers[${rowIndex}].label`"
                v-model="form.headers[rowIndex].label"
                placeholder="请输入请求头键名"
              />
            </template>
            <template #value="{ rowIndex }">
              <!-- <a-form-item :field="`form.headers[${rowIndex}].value`" :key="rowIndex">
                
              </a-form-item> -->
              <a-input
                :name="`form.headers[${rowIndex}].value`"
                v-model="form.headers[rowIndex].value"
                placeholder="请输入请求头键值"
              />
            </template>
            <template #footer>
              <a-button type="secondary" @click="form.headers.push({ label: '', value: '' })">
                <icon-plus /> 新增参数
              </a-button>
            </template>
            <template #optional="{ rowIndex }">
              <a-button @click="form.headers.splice(rowIndex, 1)"> <icon-delete /></a-button>
            </template>
          </a-table>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<style scoped></style>
