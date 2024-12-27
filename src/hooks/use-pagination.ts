import { initPagination } from '@/config'
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  useTemplateRef,
  watch,
  type Ref,
} from 'vue'
import { type BasePaginationReq, type BasePaginationResponse } from '@/models/base'
import { useRoute } from 'vue-router'

export const usePagination = <T>(
  fetchFunction: (req: BasePaginationReq) => Promise<BasePaginationResponse<T>>,
  loadMoreRefKey: string = 'load-more',
) => {
  const pagination = reactive({ ...initPagination })
  const isLoading = ref<boolean>(false)
  const loadMore = useTemplateRef<HTMLDivElement>(loadMoreRefKey)

  const data = ref<T[]>([]) as Ref<T[]>

  const route = useRoute()

  let observer: IntersectionObserver | null = null

  const loadData = async (isInit: boolean, search: string = '') => {
    try {
      isLoading.value = true
      const res = await fetchFunction({
        current_page: pagination.currentPage,
        page_size: pagination.pageSize,
        search_word: search,
      })

      if (isInit) {
        data.value = res.data.list
      } else {
        data.value = [...data.value, ...res.data.list]
      }

      pagination.totalPage = res.data.paginator.total_page
      pagination.totalRecord = res.data.paginator.total_record
      pagination.currentPage = res.data.paginator.current_page
      pagination.pageSize = res.data.paginator.page_size

      if (pagination.totalPage <= pagination.currentPage && loadMore.value) {
        observer?.unobserve(loadMore.value)
      }
    } finally {
      isLoading.value = false
    }
  }

  const initObserver = () => {
    const options = {
      rootMargin: '0px',
      threshold: 1.0,
    }

    if (observer) {
      observer.disconnect()
      observer = null
    }

    if (pagination.currentPage < pagination.totalPage) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (pagination.currentPage < pagination.totalPage) {
            pagination.currentPage += 1
            loadData(false, route.query.search as string)
          }
        }
      }, options)

      if (loadMore.value) {
        observer.observe(loadMore.value)
      }
    }
  }

  onMounted(async () => {
    await loadData(true, route.query.search as string)

    initObserver()
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  watch(
    () => route.query.search,
    async (newValue) => {
      resetPagination()

      await loadData(true, newValue as string)

      initObserver()
    },
  )

  const resetPagination = () => {
    pagination.currentPage = initPagination.currentPage
    pagination.pageSize = initPagination.pageSize
    pagination.totalPage = initPagination.totalPage
    pagination.totalRecord = initPagination.totalRecord
  }

  const reloadData = () => {
    resetPagination()
    loadData(true, route.query.search as string).then(() => {
      initObserver()
    })
  }

  const needShowLoadMore = computed(() => {
    return pagination.currentPage < pagination.totalPage
  })

  return {
    data,
    reloadData,
    isLoading,
    pagination,
    needShowLoadMore,
  }
}
