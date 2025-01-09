<script setup lang="ts">
import AppCard, { type Props as AppCardProps } from '@/components/AppCard.vue'
import { addBuiltinAppToSpace } from '@/services/builtin-app-service'
import { useRouter } from 'vue-router'

type Props = Omit<AppCardProps, 'href'>

const props = defineProps<Props>()
const router = useRouter()

const handleSelect = (value: string) => {
  if (value === 'addToSpace') {
    addBuiltinAppToSpace(props.id).then((res) => {
      const id = res.data.id
      router.push(`/space/apps/${id}/detail`)
    })
    return
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
  >
    <template #operation>
      <a-dropdown @select="(value) => handleSelect(value as string)">
        <a-button>
          <template #icon>
            <icon-more />
          </template>
        </a-button>
        <template #content>
          <a-doption value="addToSpace">添加到工作区</a-doption>
        </template>
      </a-dropdown>
    </template>
  </app-card>
</template>

<style scoped></style>
