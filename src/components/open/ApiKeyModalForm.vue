<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { reactive } from 'vue'

export type FormData = {
  isActive: boolean
  remark: string
}

const props = defineProps<{
  data: FormData
  visible: boolean
  title: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'submit', value: FormData): void
}>()

const form = reactive<FormData>(props.data)

const handleOk = () => {
  if (form.remark.length > 2000) {
    Message.error('备注长度不能超过 2000 个字符')
    return
  }

  emit('submit', form)
  emit('update:visible', false)

  form.remark = ''
  form.isActive = true
}

const handleCancel = () => {
  emit('update:visible', false)
}
</script>

<template>
  <div>
    <a-modal
      :visible="visible"
      @cancel="handleCancel"
      :title="title"
      title-align="start"
      @ok="handleOk"
    >
      <a-form :model="form" layout="vertical">
        <a-form-item label="密钥状态" field="isActive" required asterisk-position="end">
          <a-switch v-model="form.isActive" type="round" />
        </a-form-item>
        <a-form-item label="备注" field="remark">
          <a-textarea
            class="rounded-lg"
            v-model="form.remark"
            :max-length="2000"
            show-word-limit
            placeholder="请输入秘钥备注，用于描述秘钥基础信息"
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped></style>
