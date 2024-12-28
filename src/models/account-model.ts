import type { BaseResponse } from './base'

export type GetCurrentUserResponse = BaseResponse<{
  id: string
  name: string
  email: string
  avatar: string
  last_login_at: number
  last_login_ip: string
  created_at: number
}>
