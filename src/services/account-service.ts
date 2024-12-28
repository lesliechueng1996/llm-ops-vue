import { get, put } from '@/utils/request'
import { type GetCurrentUserResponse } from '@/models/account-model'

export const getCurrentUser = () => {
  return get<GetCurrentUserResponse>('/account')
}

export const updateCurrentUserName = (name: string) => {
  return put('/account/name', {
    body: {
      name,
    },
  })
}

export const updateCurrentUserPassword = (password: string) => {
  return put('/account/password', {
    body: {
      password,
    },
  })
}

export const updateCurrentUserAvatar = (avatar: string) => {
  return put('/account/avatar', {
    body: {
      avatar,
    },
  })
}
