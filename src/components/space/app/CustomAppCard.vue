<script setup lang="ts">
import AppCard, { type Props as AppCardProps } from '@/components/AppCard.vue'
import { Modal } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import { copyApp } from '@/services/app-service'

type Props = Omit<AppCardProps, 'href'> & {
  isPublished: boolean
}

const router = useRouter()

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'edit-app', id: string): void
  (e: 'delete-app', id: string): void
}>()

const handleSelect = (value: string) => {
  if (value === 'analysis') {
    router.push(`/space/apps/${props.id}/analysis`)
    return
  }

  if (value === 'edit') {
    emit('edit-app', props.id)
    return
  }

  if (value === 'delete') {
    Modal.warning({
      title: '要删除该应用吗？',
      content:
        '删除应用后，发布的WebApp、开放API以及关联的社交媒体平台均无法使用该Agent应用，如果需要暂停应用，可使用取消发布功能。',
      okText: '确认',
      onOk() {
        emit('delete-app', props.id)
      },
    })

    return
  }

  if (value === 'copy') {
    copyApp(props.id).then((res) => {
      router.push(`/space/apps/${res.data.app_id}/detail`)
    })
  }
}
</script>

<template>
  <app-card
    :id="id"
    :icon="icon"
    :label="label"
    :provider="provider"
    :model="model"
    :created-at="createdAt"
    :updated-at="updatedAt"
    :description="description"
    :href="`/space/apps/${id}/detail`"
  >
    <template #badge v-if="isPublished">
      <icon-check-circle-fill size="16" class="text-green-700" />
    </template>
    <template #operation>
      <a-dropdown @select="(value) => handleSelect(value as string)">
        <a-button>
          <template #icon>
            <icon-more />
          </template>
        </a-button>
        <template #content>
          <a-doption value="analysis">分析</a-doption>
          <a-doption value="edit">编辑应用</a-doption>
          <a-doption value="copy">创建副本</a-doption>
          <a-doption class="text-red-700" value="delete">删除</a-doption>
        </template>
      </a-dropdown>
    </template>
  </app-card>
</template>

<style scoped></style>
