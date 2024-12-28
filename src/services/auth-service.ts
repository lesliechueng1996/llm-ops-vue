import type { PasswordLoginRequest, PasswordLoginResponse } from '@/models/auth-model'
import type { BaseResponse } from '@/models/base'
import { post } from '@/utils/request'

export const passwordLogin = (data: PasswordLoginRequest) =>
  post<PasswordLoginResponse>('/auth/password-login', {
    body: data,
  })

export const logout = () => post<BaseResponse<unknown>>('/auth/logout')
