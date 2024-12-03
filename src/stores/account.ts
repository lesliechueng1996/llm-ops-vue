import { defineStore } from 'pinia'
import { ref } from 'vue'

type Account = {
  name: string
  email: string
  avatar: string
}

const initAccount: Account = {
  name: 'Leslie',
  email: 'test@163.com',
  avatar: '',
}

export const useAccountStore = defineStore('account', () => {
  const account = ref<Account>({ ...initAccount })

  const update = (newAccount: Partial<Account>) => {
    account.value = { ...account.value, ...newAccount }
  }

  const clear = () => {
    account.value = { ...initAccount }
  }

  return { account, update, clear }
})
