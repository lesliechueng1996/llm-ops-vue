import { useRoute } from 'vue-router'
import { hitTesting, getDatasetRecentQuery } from '@/services/dataset-service'
import { type HitTestingResponse, type DatasetRecentQueryResponse } from '@/models/dataset-model'
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'

type HitDoc = HitTestingResponse['data'][0]
type RecentQuery = DatasetRecentQueryResponse['data'][0]

export const useHitTesting = () => {
  const route = useRoute()
  const datasetId = route.params.datasetId as string

  const hitDocs = ref<HitDoc[]>([])
  const recentQueries = ref<RecentQuery[]>([])

  const hit = async (
    text: string,
    strategy: 'hybrid' | 'semantic' | 'full_text',
    maxResults: number,
    minScore: number,
  ) => {
    const response = await hitTesting(datasetId, {
      query: text,
      retrieval_strategy: strategy,
      k: maxResults,
      score: minScore,
    })
    hitDocs.value = response.data
    Message.success('检索成功')
    loadRecentQueries()
  }

  const loadRecentQueries = async () => {
    const response = await getDatasetRecentQuery(datasetId)
    recentQueries.value = response.data
  }

  return {
    hitDocs,
    hit,
    recentQueries,
    loadRecentQueries,
  }
}
