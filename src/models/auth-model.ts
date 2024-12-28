import type { BaseResponse } from './base'

export type PasswordLoginRequest = {
  email: string
  password: string
}

export type PasswordLoginResponse = BaseResponse<{
  access_token: string
  expire_at: number
}>
