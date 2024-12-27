import type { GetDocumentResponse } from '@/models/document-model'
import { useRoute } from 'vue-router'
import { getDocument, updateDocumentEnabled } from '@/services/document-service'
import { onMounted, ref } from 'vue'
import { usePagination } from './use-pagination'
import { getSegmentsByPagination, deleteSegment } from '@/services/segment-service'

export const useSegments = () => {
  const route = useRoute()
  const datasetId = route.params.datasetId as string
  const documentId = route.params.documentId as string
  const enableLoading = ref(false)

  const belongDocument = ref<GetDocumentResponse['data'] | null>(null)

  const { data, reloadData, isLoading, needShowLoadMore } = usePagination(
    getSegmentsByPagination.bind(null, datasetId, documentId),
  )

  const loadDocument = async () => {
    const res = await getDocument(datasetId, documentId)
    belongDocument.value = res.data
  }

  onMounted(async () => {
    await loadDocument()
  })

  const handleEnableChange = async (enabled: boolean) => {
    try {
      enableLoading.value = true
      await updateDocumentEnabled(datasetId, documentId, enabled)
      await loadDocument()
    } catch (error) {
      console.error(error)
    } finally {
      enableLoading.value = false
    }
  }

  const handleDelete = async (id: string) => {
    await deleteSegment(datasetId, documentId, id)
    reloadData()
    loadDocument()
  }

  return {
    datasetId,
    documentId,
    belongDocument,
    enableLoading,
    handleEnableChange,
    data,
    reloadData,
    isLoading,
    needShowLoadMore,
    handleDelete,
    loadDocument,
  }
}
