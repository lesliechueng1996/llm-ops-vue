import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storage } from '@/utils/storage'

type Account = {
  id: string
  name: string
  email: string
  avatar: string
  last_login_ip: string
  last_login_at: number
  created_at: number
}

const initAccount: Account = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  last_login_ip: '',
  last_login_at: 0,
  created_at: 0,
}

const ACCOUNT_KEY = 'account'

export const useAccountStore = defineStore('account', () => {
  const account = ref<Account>(storage.get(ACCOUNT_KEY, initAccount))

  const update = (newAccount: Partial<Account>) => {
    account.value = { ...account.value, ...newAccount }
    storage.set(ACCOUNT_KEY, account.value)
  }

  const clear = () => {
    account.value = { ...initAccount }
    storage.remove(ACCOUNT_KEY)
  }

  return { account, update, clear }
})
