import { nextTick, reactive, ref, type ShallowRef } from 'vue'
import { initPagination } from '@/config'
import { useRoute } from 'vue-router'
import {
  debugAppStream,
  deleteDebugConversation,
  getConversationMessagesPagination,
} from '@/services/app-service'
import { QueueEvent, type GetConversationMessagesPaginationResponse } from '@/models/app-model'
import { Message } from '@arco-design/web-vue'
import { nanoid } from 'nanoid'

interface RecycleScroller {
  scrollToBottom: () => void
  $el: HTMLElement
}

export type Message = {
  id: string
  query: string
  answer: string
  totalTokenCount: number
  latency: number
  agentThoughts: {
    id: string
    position: number
    event: string
    thought: string
    observation: string
    latency: number
  }[]
}

export const useChatBot = (scroller: Readonly<ShallowRef<RecycleScroller | null>>) => {
  const route = useRoute()
  const appId = route.params.appId as string

  const messages = ref<Message[]>([])
  const query = ref<string>('')
  const isLoading = ref(false)

  const pagination = reactive({ ...initPagination })
  const isMessagesLoading = ref(false)

  const loadMessages = async (isInit: boolean, createdAt?: number) => {
    isMessagesLoading.value = true
    try {
      const res = await getConversationMessagesPagination(
        {
          current_page: pagination.currentPage,
          page_size: pagination.pageSize,
        },
        appId,
        createdAt,
      )

      const formatMessages = (
        messages: GetConversationMessagesPaginationResponse['data']['list'],
      ) => {
        return messages.map((item) => ({
          id: item.id,
          query: item.query,
          answer: item.answer,
          totalTokenCount: item.total_token_count,
          latency: item.latency,
          agentThoughts: item.agent_thoughts.map((thought) => ({
            id: thought.id,
            position: thought.position,
            event: thought.event,
            thought: thought.thought,
            observation: thought.observation,
            latency: thought.latency,
          })),
        }))
      }

      const newMessages = formatMessages(res.data.list)

      if (isInit) {
        messages.value = newMessages.reverse()
      } else {
        messages.value = [...newMessages.reverse(), ...(messages.value ?? [])]
      }

      pagination.totalPage = res.data.paginator.total_page
      pagination.totalRecord = res.data.paginator.total_record
      pagination.currentPage = res.data.paginator.current_page
      pagination.pageSize = res.data.paginator.page_size

      if (pagination.currentPage <= pagination.totalPage) {
        pagination.currentPage += 1
      }
    } finally {
      isMessagesLoading.value = false
    }
  }

  const sendMessage = async () => {
    if (!query.value) {
      Message.error('请输入内容')
      return
    }

    if (isLoading.value) {
      Message.warning('正在加载，请稍后')
      return
    }

    const humanQuery = query.value
    query.value = ''
    const tempId = nanoid()
    messages.value.push({
      id: tempId,
      query: humanQuery,
      answer: '',
      totalTokenCount: 0,
      latency: 0,
      agentThoughts: [],
    })
    nextTick(() => {
      scroller.value?.scrollToBottom()
    })

    try {
      isLoading.value = true
      const res = debugAppStream(appId, humanQuery)

      let position = 0

      for await (const item of res) {
        if (isLoading.value) {
          const event = item.event as QueueEvent
          const data = item.data

          const eventId = data.id
          const lastMessage = messages.value[messages.value.length - 1]
          const agentThoughts = lastMessage.agentThoughts

          if (lastMessage.id === tempId && data.message_id) {
            messages.value[messages.value.length - 1].id = data.message_id
          }

          if (event !== QueueEvent.PING) {
            if (event === QueueEvent.AGENT_MESSAGE) {
              const messageAgentThoughtIndex = agentThoughts.findIndex(
                (thought) => thought.id === eventId,
              )
              if (messageAgentThoughtIndex !== -1) {
                agentThoughts[messageAgentThoughtIndex] = {
                  ...agentThoughts[messageAgentThoughtIndex],
                  thought: agentThoughts[messageAgentThoughtIndex].thought + data.thought,
                  observation:
                    agentThoughts[messageAgentThoughtIndex].observation + data.observation,
                  latency: data.latency,
                }
              } else {
                position += 1
                agentThoughts.push({
                  id: eventId,
                  position,
                  event: QueueEvent.AGENT_MESSAGE,
                  thought: data.thought,
                  observation: data.observation,
                  latency: data.latency,
                })
              }

              messages.value[messages.value.length - 1].answer += data.thought
            } else {
              position += 1
              agentThoughts.push({
                id: eventId,
                position,
                event: event,
                thought: data.thought,
                observation: data.observation,
                latency: data.latency,
              })
            }

            messages.value[messages.value.length - 1].agentThoughts = agentThoughts
            scroller.value?.scrollToBottom()
          }
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const deleteConversation = async () => {
    pagination.currentPage = initPagination.currentPage
    pagination.pageSize = initPagination.pageSize
    pagination.totalPage = initPagination.totalPage
    pagination.totalRecord = initPagination.totalRecord

    await deleteDebugConversation(appId)
    await loadMessages(true)
  }

  return {
    messages,
    query,
    isLoading,
    isMessagesLoading,
    loadMessages,
    sendMessage,
    deleteConversation,
  }
}
