<script setup lang="ts">
</script>

<template>
  <div class="h-screen w-full flex flex-col bg-[#0f172a] text-white overflow-hidden">
    <!-- Top Navigation Bar -->
    <header class="h-[60px] flex items-center px-6 border-b border-white/10 backdrop-blur-md z-10 relative">
      <div class="text-xl font-bold tracking-widest text-white/90">
        RAYMI ELECTRON
      </div>
      <div class="flex-1"></div>
      <nav class="flex gap-4 text-sm font-medium text-white/60">
        <div class="hover:text-white cursor-pointer transition-colors duration-300">Home</div>
        <div class="hover:text-white cursor-pointer transition-colors duration-300">About</div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1 relative">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
