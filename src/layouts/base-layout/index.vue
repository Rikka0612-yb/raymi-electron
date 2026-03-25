<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menuOptions = [
  {
    label: 'Raymi的小窝',
    key: 'chat',
    path: '/chat'
  }
]

const handleMenuClick = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="h-screen w-full flex flex-col bg-slate-50 text-slate-800 overflow-hidden">
    <!-- Top Navigation Bar -->
    <header class="h-[60px] flex items-center px-6 border-b border-slate-200 bg-white z-10 relative shrink-0 shadow-sm">
      <div class="text-xl font-bold tracking-widest text-indigo-600 cursor-pointer transition-colors hover:text-indigo-500" @click="router.push('/')">
        RAYMI ELECTRON
      </div>
      <div class="flex-1"></div>
    </header>

    <!-- Main Content Area -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- Left Sidebar -->
      <aside class="w-[240px] border-r border-slate-200 bg-white flex flex-col shrink-0 z-10">
        <div class="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          功能导航
        </div>
        <nav class="flex-1 px-3 space-y-1">
          <div 
            v-for="item in menuOptions" 
            :key="item.key"
            @click="handleMenuClick(item.path)"
            class="px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 font-medium text-sm flex items-center"
            :class="route.path.startsWith(item.path) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
          >
            {{ item.label }}
          </div>
        </nav>
      </aside>

      <!-- Right Router View -->
      <main class="flex-1 relative bg-white overflow-hidden m-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
