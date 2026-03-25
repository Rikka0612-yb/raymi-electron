<script setup lang="ts">
import { NButton } from 'naive-ui'
</script>

<template>
  <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#0f172a]">
    <!-- Geometric Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[80px] animate-blob"></div>
      <div class="absolute top-1/3 right-1/4 w-[35vw] h-[35vw] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-1/4 left-1/3 w-[45vw] h-[45vw] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-4000"></div>
      
      <!-- Minimalist lines/shapes -->
      <svg class="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="20%" x2="100%" y2="20%" stroke="white" stroke-width="0.5" stroke-dasharray="4 8" />
        <line x1="0" y1="80%" x2="100%" y2="80%" stroke="white" stroke-width="0.5" stroke-dasharray="4 8" />
        <line x1="30%" y1="0" x2="30%" y2="100%" stroke="white" stroke-width="0.5" stroke-dasharray="4 8" />
        <line x1="70%" y1="0" x2="70%" y2="100%" stroke="white" stroke-width="0.5" stroke-dasharray="4 8" />
        
        <circle cx="30%" cy="20%" r="4" fill="none" stroke="white" stroke-width="1" />
        <circle cx="70%" cy="80%" r="4" fill="none" stroke="white" stroke-width="1" />
        <circle cx="70%" cy="20%" r="4" fill="none" stroke="white" stroke-width="1" />
        <circle cx="30%" cy="80%" r="4" fill="none" stroke="white" stroke-width="1" />
      </svg>
    </div>

    <!-- Poetic Text Content -->
    <div class="relative z-10 flex flex-col items-center justify-center text-center space-y-8 px-6">
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-light text-white/80 tracking-widest opacity-0 animate-fade-in-up">
        那么多灯火遥遥
      </h2>
      
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 tracking-[0.2em] opacity-0 animate-fade-in-up animation-delay-1000">
        Raymi
      </h1>
      
      <p class="text-xl md:text-2xl font-light text-white/60 tracking-widest mt-8 opacity-0 animate-fade-in-up animation-delay-2000 max-w-2xl leading-relaxed">
        真想跟你去走风暴中安静的雪地
      </p>
      
      <div class="pt-16 opacity-0 animate-fade-in-up animation-delay-3000">
        <n-button 
          ghost 
          color="#8b5cf6" 
          size="large"
          class="px-8 font-light tracking-widest hover:bg-purple-500/10 transition-all duration-300"
          @click="$router.push('/chat')"
        >
          探索旅程
        </n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-blob {
  animation: blob 10s infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 1.5s ease-out forwards;
}

.animation-delay-1000 {
  animation-delay: 0.5s;
}

.animation-delay-2000 {
  animation-delay: 1s;
}

.animation-delay-3000 {
  animation-delay: 1.5s;
}

.animation-delay-4000 {
  animation-delay: 2s;
}
</style>
