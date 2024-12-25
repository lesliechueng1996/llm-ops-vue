<script setup lang="ts">
import CommonCard from '@/components/CommonCard.vue'
import CommonCardHeader from '@/components/CommonCardHeader.vue'
import { type GetDatasetPaginationResponse } from '@/models/dataset-model'

type Dataset = GetDatasetPaginationResponse['data']['list'][0]

defineProps<{
  dataset: Dataset
}>()

const handleSelect = (key: string | number | Record<string, unknown> | undefined) => {
  console.log(key)
}
</script>

<template>
  <common-card
    :description="dataset.description"
    :created-at="dataset.created_at"
    :updated-at="dataset.updated_at"
  >
    <template #header>
      <common-card-header :label="dataset.name" :icon="dataset.icon">
        <template #name>
          <p>
            {{ dataset.document_count }} 文档 ·
            {{ Math.round(dataset.character_count / 1000) }} 千字符 ·
            {{ dataset.related_app_count }} 关联应用
          </p>
        </template>
        <template #operation>
          <a-dropdown @select="handleSelect">
            <a-button>
              <template #icon>
                <icon-more />
              </template>
            </a-button>
            <template #content>
              <a-doption value="edit">设置</a-doption>
              <a-doption class="text-red-700" value="delete">删除</a-doption>
            </template>
          </a-dropdown>
        </template>
      </common-card-header>
    </template>
  </common-card>
</template>

<style scoped></style>
