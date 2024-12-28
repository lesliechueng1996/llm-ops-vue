import type { GetOAuthRedirectUrlResponse, OAuthAuthorizeResponse } from '@/models/oauth-model'
import { get, post } from '@/utils/request'

export const getOAuthRedirectUrl = (providerName: string) =>
  get<GetOAuthRedirectUrlResponse>(`/oauth/${providerName}`)

export const oauthAuthorize = (providerName: string, code: string) =>
  post<OAuthAuthorizeResponse>(`/oauth/authorize/${providerName}`, {
    body: { code },
  })
