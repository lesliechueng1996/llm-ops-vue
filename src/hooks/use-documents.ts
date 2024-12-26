import { useRoute } from 'vue-router'
import { getDataset } from '@/services/dataset-service'
import { getDocumentPagination, updateDocumentEnabled } from '@/services/document-service'
import { onMounted, reactive, ref, watch } from 'vue'
import { initPagination } from '@/config'
import { Message } from '@arco-design/web-vue'

type Dataset = Awaited<ReturnType<typeof getDataset>>['data']
type Document = Awaited<ReturnType<typeof getDocumentPagination>>['data']['list'][0]

export const useDataset = () => {
  const route = useRoute()

  const datasetId = route.params.datasetId as string
  const dataset = ref<Dataset | null>(null)

  onMounted(async () => {
    await reloadDataset()
  })

  const reloadDataset = async () => {
    const res = await getDataset(datasetId)
    dataset.value = res.data
  }

  return {
    dataset,
    datasetId,
    reloadDataset,
  }
}

export const useDocuments = () => {
  const route = useRoute()
  const datasetId = route.params.datasetId as string
  const isLoading = ref<boolean>(false)

  const data = ref<Document[]>([])
  const pagination = reactive({ ...initPagination })

  const enabledLoadingMap = ref<Record<string, boolean>>({})

  const loadData = async () => {
    try {
      isLoading.value = true
      const res = await getDocumentPagination(datasetId, {
        current_page: pagination.currentPage,
        page_size: pagination.pageSize,
        search_word: route.query.search as string,
      })

      data.value = res.data.list
      pagination.totalPage = res.data.paginator.total_page
      pagination.totalRecord = res.data.paginator.total_record
      pagination.currentPage = res.data.paginator.current_page
      pagination.pageSize = res.data.paginator.page_size
    } finally {
      isLoading.value = false
    }
  }

  const resetPagination = () => {
    pagination.currentPage = initPagination.currentPage
    pagination.pageSize = initPagination.pageSize
    pagination.totalPage = initPagination.totalPage
    pagination.totalRecord = initPagination.totalRecord
  }

  watch(
    () => route.query.search,
    async () => {
      resetPagination()
      await loadData()
    },
  )

  onMounted(async () => {
    await loadData()
  })

  const changeEnabledHandler = async (id: string, enabled: boolean) => {
    try {
      enabledLoadingMap.value[id] = true
      await updateDocumentEnabled(datasetId, id, enabled)
      await loadData()
      Message.success(`${enabled ? '启用' : '禁用'}成功`)
    } catch {
      Message.error(`${enabled ? '启用' : '禁用'}失败`)
    } finally {
      enabledLoadingMap.value[id] = false
    }
  }

  const pageChangeHandler = async (page: number) => {
    pagination.currentPage = page
    await loadData()
  }

  const reloadData = async () => {
    resetPagination()
    await loadData()
  }

  return {
    data,
    changeEnabledHandler,
    pageChangeHandler,
    pagination,
    reloadData,
    enabledLoadingMap,
  }
}
