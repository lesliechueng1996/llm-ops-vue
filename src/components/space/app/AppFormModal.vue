<script setup lang="ts">
import { Message, type FileItem } from '@arco-design/web-vue'
import { reactive, ref } from 'vue'
import { uploadImage } from '@/services/upload-file-service'
import { nanoid } from 'nanoid'

export type FormData = {
  name: string
  description: string
  icon: string
}

const { title, visible, initialData } = defineProps<{
  title: string
  visible: boolean
  initialData: FormData
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit', form: FormData): void
}>()

const form = reactive<FormData>(initialData)
const formRef = ref()
const file = ref<File | null>(null)
const okLoading = ref(false)
const defaultFileList = ref<FileItem[]>()

if (initialData.icon) {
  defaultFileList.value = [{ uid: nanoid(), url: initialData.icon }]
}

const handleOk = async () => {
  try {
    okLoading.value = true
    const errors = await formRef.value.validate()
    if (errors) {
      return
    }

    if (file.value) {
      const res = await uploadImage(file.value)
      form.icon = res.data.image_url
    } else {
      Message.error('请上传应用图标')
      return
    }

    emit('submit', form)
  } catch {
    Message.error('创建应用失败')
  } finally {
    okLoading.value = false
  }
}

const handleFileChange = (fileList: FileItem[]) => {
  file.value = fileList[0]?.file ?? null
}
</script>

<template>
  <a-modal
    :visible="visible"
    ok-text="保存"
    @cancel="emit('cancel')"
    @ok="handleOk"
    :ok-loading="okLoading"
  >
    <template #title> {{ title }} </template>
    <div class="max-h-96 overflow-y-scroll">
      <a-form ref="formRef" :model="form" layout="vertical">
        <a-form-item field="icon">
          <a-upload
            class="flex w-full"
            list-type="picture-card"
            action="/"
            image-preview
            :auto-upload="false"
            :limit="1"
            :show-retry-button="false"
            :default-file-list="defaultFileList"
            @change="handleFileChange"
          />
        </a-form-item>
        <a-form-item field="name" label="应用名称" required>
          <a-input
            v-model="form.name"
            placeholder="应用名称不能为空"
            show-word-limit
            :max-length="40"
          />
        </a-form-item>
        <a-form-item field="description" label="应用描述">
          <a-textarea
            v-model="form.description"
            placeholder="请输入知识库内容的描述"
            show-word-limit
            :max-length="800"
            :auto-size="{
              minRows: 2,
              maxRows: 5,
            }"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<style scoped></style>
