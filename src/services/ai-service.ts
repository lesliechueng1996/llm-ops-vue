import type { BaseResponse } from '@/models/base'
import { post, ssePost } from '@/utils/request'

export const optimizePrompt = (prompt: string) => {
  return ssePost<{ optimize_prompt: string }>('/ai/optimize-prompt', {
    body: {
      prompt,
    },
  })
}

export const suggestedQuestions = (messageId: string) => {
  return post<BaseResponse<string[]>>(`/ai/suggested-questions`, {
    body: {
      message_id: messageId,
    },
  })
}
