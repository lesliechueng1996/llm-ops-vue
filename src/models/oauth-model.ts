import type { BaseResponse } from './base'

export type GetOAuthRedirectUrlResponse = BaseResponse<{
  redirect_url: string
}>

export type OAuthAuthorizeResponse = BaseResponse<{
  access_token: string
  expire_at: number
}>
