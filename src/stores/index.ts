import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export function setupStore() {
  const store = createPinia()
  store.use(piniaPluginPersistedstate)
  return store
}

export const store = setupStore()
export default store
