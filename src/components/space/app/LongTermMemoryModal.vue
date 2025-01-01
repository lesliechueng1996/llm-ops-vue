<script setup lang="ts">
import { ref, watch } from 'vue'
import { getLongTermMemory, updateLongTermMemory } from '@/services/app-service'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits(['update:visible'])

const route = useRoute()
const appId = route.params.appId as string

const handleOk = async () => {
  await updateLongTermMemory(appId, summary.value)
  Message.success('更新成功')
  emit('update:visible', false)
}

const summary = ref('')

watch(
  () => props.visible,
  async (newVal) => {
    if (newVal) {
      const res = await getLongTermMemory(appId)
      summary.value = res.data.summary
    } else {
      summary.value = ''
    }
  },
)
</script>

<template>
  <a-modal
    :width="600"
    :visible="visible"
    title="长期记忆"
    title-align="start"
    ok-text="更新记忆"
    @ok="handleOk"
    @cancel="emit('update:visible', false)"
  >
    <a-textarea v-model="summary" :auto-size="{ minRows: 8, maxRows: 10 }" class="rounded-lg" />
  </a-modal>
</template>

<style scoped></style>
