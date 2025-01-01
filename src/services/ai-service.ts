import { ssePost } from '@/utils/request'

export const optimizePrompt = (prompt: string) => {
  return ssePost<{ optimize_prompt: string }>('/ai/optimize-prompt', {
    body: {
      prompt,
    },
  })
}
