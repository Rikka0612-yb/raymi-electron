import { createApp } from 'vue'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import './style.css'
import App from './App.vue'
import { router, setupRouter } from './router'
import { setupStore } from './stores'

async function bootstrap() {
  const app = createApp(App)

  // Configure store
  const store = setupStore()
  app.use(store)

  // Configure router
  setupRouter(app)
  
  // Wait for router to be ready before mounting
  await router.isReady()

  // Mount app
  app.mount('#app')
}

bootstrap()
