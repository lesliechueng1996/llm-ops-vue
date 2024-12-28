import { ref } from 'vue'
import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'

type Credential = {
  access_token: string
  expire_at: number
}

const initCredential: Credential = {
  access_token: '',
  expire_at: 0,
}

const CREDENTIAL_KEY = 'credential'

export const useCredentialStore = defineStore('credential', () => {
  const credential = ref<Credential>(storage.get(CREDENTIAL_KEY, initCredential))

  const update = (newCredential: Partial<Credential>) => {
    credential.value = { ...credential.value, ...newCredential }
    storage.set(CREDENTIAL_KEY, credential.value)
  }

  const clear = () => {
    credential.value = initCredential
    storage.remove(CREDENTIAL_KEY)
  }

  return { credential, update, clear }
})
