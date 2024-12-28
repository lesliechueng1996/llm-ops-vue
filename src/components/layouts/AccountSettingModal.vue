<script setup lang="ts">
import { uploadImage } from '@/services/upload-file-service'
import {
  Message,
  type FileItem,
  type RequestOption,
  type UploadRequest,
} from '@arco-design/web-vue'
import { ref } from 'vue'
import EditableLabel from './EditableLabel.vue'
import { useAccountStore } from '@/stores/account'
import {
  updateCurrentUserName,
  updateCurrentUserPassword,
  updateCurrentUserAvatar,
} from '@/services/account-service'

const accountStore = useAccountStore()

defineProps<{
  visible: boolean
}>()

const emit = defineEmits(['update:visible'])

const handleOk = () => {
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('update:visible', false)
}

const activeKey = ref('account')
const fileList = ref<FileItem[]>([
  {
    uid: '0',
    name: 'avatar',
    url: accountStore.account.avatar,
  },
])
const form = ref({
  avatar: '',
  name: '',
  password: '',
})

const uploadFiles = (option: RequestOption): UploadRequest => {
  const { fileItem, onProgress, onError, onSuccess } = option
  const result: UploadRequest = {}

  const file = fileItem.file
  if (!file) {
    onError(new Error('文件为空'))
    return result
  }

  const handleFunc = async () => {
    try {
      const res = await uploadImage(file, onProgress)
      onSuccess(res)
      const url = res.data.image_url
      await updateCurrentUserAvatar(url)
      accountStore.update({
        avatar: url,
      })
      Message.success('更新成功')
    } catch (error) {
      onError(error as Error)
      Message.error('更新失败')
    }
  }

  handleFunc()

  return result
}

const handleSaveName = async (value: string) => {
  if (!value) {
    Message.error('请输入账号名称')
    return
  }
  if (value === accountStore.account.name) {
    return
  }

  try {
    await updateCurrentUserName(value)
    accountStore.update({
      name: value,
    })
    Message.success('更新成功')
  } catch {
    Message.error('更新失败')
  }
}

const handleSavePassword = async (value: string) => {
  if (!value) {
    Message.error('请输入账号密码')
    return
  }
  if (value.length > 16) {
    Message.error('账号密码不能超过16个字符')
    return
  }
  if (value.length < 8) {
    Message.error('账号密码不能少于8个字符')
    return
  }
  if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/.test(value)) {
    Message.error('账号密码必须包含字母和数字')
    return
  }

  await updateCurrentUserPassword(value)
  Message.success('更新成功')
}
</script>

<template>
  <a-modal
    :width="1000"
    modal-class="h-[620px] rounded-lg"
    body-class="p-0 h-full"
    :visible="visible"
    hide-title
    :footer="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="p-6 flex h-full">
      <div class="w-56 h-full pr-2">
        <h1 class="text-xl font-bold text-gray-800 mb-5">设置</h1>
        <div class="space-y-2">
          <div
            :class="`w-full rounded-lg text-sm text-gray-700 px-2 py-1.5 cursor-pointer ${activeKey === 'account' ? 'bg-gray-100' : ''}`"
            @click="activeKey = 'account'"
          >
            账号设置
          </div>
          <div
            :class="`w-full rounded-lg text-sm text-gray-700 px-2 py-1.5 cursor-pointer ${activeKey === 'channel' ? 'bg-gray-100' : ''}`"
            @click="activeKey = 'channel'"
          >
            发布渠道
          </div>
        </div>
      </div>
      <a-divider class="h-full" direction="vertical" />
      <div v-if="activeKey === 'account'" class="w-full pl-5">
        <div class="mb-6 flex justify-between items-center">
          <h1 class="text-xl font-bold text-gray-800">账号设置</h1>
          <a-button type="secondary" @click="handleCancel">
            <template #icon>
              <icon-close />
            </template>
          </a-button>
        </div>
        <a-form :model="form" layout="vertical">
          <a-form-item label="账号头像" required asterisk-position="end">
            <a-upload
              class="flex w-full"
              list-type="picture-card"
              action="/"
              image-preview
              :limit="1"
              :show-retry-button="false"
              v-model:fileList="fileList"
              :custom-request="uploadFiles"
            />
          </a-form-item>
          <a-form-item label="账号名称" required asterisk-position="end">
            <editable-label
              :value="accountStore.account.name"
              type="text"
              placeholder="请输入账号名称"
              @save="handleSaveName"
            />
          </a-form-item>
          <a-form-item label="账号密码" required asterisk-position="end">
            <editable-label
              value="******"
              type="password"
              placeholder="请输入账号密码"
              @save="handleSavePassword"
            />
          </a-form-item>
          <a-form-item label="绑定邮箱">
            <p class="text-sm text-gray-500">{{ accountStore.account.email }}</p>
          </a-form-item>
        </a-form>
      </div>
      <!-- <div v-if="activeKey === 'channel'" class="w-full pl-5">
        <h1 class="text-xl font-bold text-gray-800 mb-6">发布渠道</h1>
      </div> -->
    </div>
  </a-modal>
</template>

<style scoped></style>
