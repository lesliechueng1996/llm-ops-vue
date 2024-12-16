<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { createApiTools, validateOpenapiSchema } from '@/services/api-tool'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const formRef = ref()
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

const handleSubmit = async () => {
  try {
    const errors = await formRef.value.validate()
    if (errors) {
      return
    }
    if (!validateOpenApiSchema(form.openapiSchema)) {
      return
    }

    await createApiTools({
      name: form.name,
      icon: 'https://cn.vuejs.org/viteconf.svg',
      description: form.description,
      openapi_schema: form.openapiSchema,
      headers: form.headers.map((header) => ({
        key: header.label,
        value: header.value,
      })),
    })

    emit('cancel')
  } catch {
    Message.error('创建插件失败')
  }
}

const validateOpenApiSchema = (schemaStr: string) => {
  try {
    const schema = JSON.parse(schemaStr)
    if (!schema.server) {
      Message.error('OpenAPI Schema 缺少 server 字段')
      return null
    }
    if (!schema.description) {
      Message.error('OpenAPI Schema 缺少 description 字段')
      return null
    }
    if (!schema.paths) {
      Message.error('OpenAPI Schema 缺少 paths 字段')
      return null
    }
    const allowedMethods = ['get', 'post', 'put', 'delete', 'patch']
    const apis = []
    for (const path of Object.keys(schema.paths)) {
      for (const method of Object.keys(schema.paths[path])) {
        if (allowedMethods.includes(method)) {
          apis.push({
            path,
            method,
            operation: schema.paths[path][method],
          })
        }
      }
    }

    const operationIds: string[] = []
    const tools = []
    for (const api of apis) {
      const operationId = api.operation.operationId
      const description = api.operation.description
      const parameters = api.operation.parameters || []

      if (typeof operationId !== 'string' || !operationId) {
        Message.error('operationId必须为字符串且不能为空')
        return null
      }
      if (typeof description !== 'string' || !description) {
        Message.error('description必须为字符串且不能为空')
        return null
      }
      if (!Array.isArray(parameters)) {
        Message.error('parameters必须为数组')
        return null
      }
      if (operationIds.includes(operationId as string)) {
        Message.error('operationId 重复')
        return null
      }
      operationIds.push(operationId as string)

      tools.push({
        operationId: operationId as string,
        description: description as string,
        method: api.method,
        path: api.path,
      })
    }

    return tools
  } catch (e) {
    console.error(e)
    Message.error('OpenAPI Schema 格式错误')
    return null
  }
}

const handleOpenApiSchemaBlur = async () => {
  const tools = validateOpenApiSchema(form.openapiSchema)
  await validateOpenapiSchema(form.openapiSchema)
  if (tools) {
    availableTools.value = tools
  }
}
</script>

<template>
  <a-modal :visible="visible" ok-text="保存" @cancel="emit('cancel')" @ok="handleSubmit">
    <template #title> 新建插件 </template>
    <div class="max-h-96 overflow-y-scroll">
      <a-form ref="formRef" :model="form" layout="vertical">
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
            @blur="handleOpenApiSchemaBlur"
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
