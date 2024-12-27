import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  type CustomProcessRule,
  type ProcessType,
} from '@/components/space/dataset/document/ProcessRule.vue'
import { createDocuments } from '@/services/document-service'

export const useCreateDocuments = () => {
  const route = useRoute()
  const datasetId = route.params.datasetId as string

  const upload_file_ids = ref<string[]>([])
  const processRule = ref<{
    process_type: ProcessType
    rule?: {
      pre_process_rule: {
        id: string
        enabled: boolean
      }[]
      segment: {
        separator: string[]
        chunk_size: number
        chunk_overlap: number
      }
    }
  } | null>({
    process_type: 'automatic',
  })

  const batchId = ref<string | null>(null)

  // Step
  const step = ref(1)
  const canNext = reactive([false, true])

  const handleUploadFinish = (isFinished: boolean, fileIds?: string[]) => {
    canNext[0] = isFinished
    if (isFinished) {
      upload_file_ids.value = fileIds || []
    } else {
      upload_file_ids.value = []
    }
  }

  const handleProcessRuleFinish = (
    isFinished: boolean,
    type: ProcessType,
    rule?: CustomProcessRule,
  ) => {
    if (!isFinished) {
      processRule.value = null
    } else {
      processRule.value = {
        process_type: type,
      }

      if (type === 'custom') {
        processRule.value.rule = {
          pre_process_rule: [
            {
              id: 'remove_extra_space',
              enabled: rule?.removeExtraSpace || false,
            },
            {
              id: 'remove_url_and_email',
              enabled: rule?.removeUrlAndEmail || false,
            },
          ],
          segment: {
            separator: rule?.separator || [],
            chunk_size: rule?.chunkSize || 500,
            chunk_overlap: rule?.chunkOverlap || 50,
          },
        }
      }
    }

    canNext[1] = isFinished
  }

  const handleClickNext = async () => {
    if (step.value === 2 && processRule.value && upload_file_ids.value.length > 0) {
      const res = await createDocuments(datasetId, {
        upload_file_ids: upload_file_ids.value,
        ...processRule.value,
      })

      batchId.value = res.data.batch
    }

    step.value++
  }

  return {
    datasetId,
    step,
    canNext,
    batchId,
    handleUploadFinish,
    handleProcessRuleFinish,
    handleClickNext,
  }
}
