<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useChat } from '@/composables/useChat'
import { NInput, NButton, NSpin, NScrollbar } from 'naive-ui'
import { Send, Trash2 } from 'lucide-vue-next'

const { messages, isGenerating, sendMessage, clearChat } = useChat('Raymi0.1') // Assuming 'Raymi0.1' is the agent name
const inputMessage = ref('')
const scrollbarRef = ref<any>(null)

const handleSend = async () => {
  if (!inputMessage.value.trim() || isGenerating.value) return
  
  const content = inputMessage.value
  inputMessage.value = ''
  
  await sendMessage(content)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollbarRef.value) {
      scrollbarRef.value.scrollTo({ position: 'bottom', behavior: 'smooth' })
    }
  })
}

// Watch messages to auto-scroll
watch(
  () => messages.value,
  () => {
    scrollToBottom()
  },
  { deep: true }
)

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="h-full w-full flex flex-col p-4 bg-white rounded-xl">
    <div class="flex items-center justify-between mb-4 shrink-0 px-2">
      <div class="text-2xl font-bold tracking-wider text-slate-800">Raymi的小窝</div>
      <n-button ghost type="error" size="small" @click="clearChat" :disabled="isGenerating">
        <template #icon><Trash2 class="w-4 h-4" /></template>
        清空对话
      </n-button>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col overflow-hidden">
      <n-scrollbar ref="scrollbarRef" class="flex-1 pr-4">
        <div class="space-y-6 pb-4">
          <div v-if="messages.length === 0" class="text-center text-slate-400 mt-20 flex flex-col items-center">
            <div class="text-4xl mb-4 opacity-50">✨</div>
            <p>准备好开始一段奇妙的旅程了吗？</p>
            <p class="text-sm mt-2">输入消息，与 Raymi 对话</p>
          </div>

          <div 
            v-for="(msg, index) in messages" 
            :key="index"
            class="flex items-start gap-3"
            :class="msg.messageType === 'user' ? 'flex-row-reverse' : 'flex-row'"
          >
            <!-- Avatar -->
            <div class="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-white">
              <img v-if="msg.messageType === 'user'" src="https://rikka-0712.oss-cn-hangzhou.aliyuncs.com/avator_my.jpg"/>
              <img v-else src="https://rikka-0712.oss-cn-hangzhou.aliyuncs.com/avator_raymi.jpg" alt="Raymi" class="w-full h-full object-cover"/>
            </div>

            <!-- User Message -->
            <div v-if="msg.messageType === 'user'" class="max-w-[80%] bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm break-words whitespace-pre-wrap">
              {{ msg.content }}
            </div>

            <!-- Assistant Message -->
            <div v-else-if="msg.messageType === 'assistant'" class="max-w-[80%] bg-white border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm prose prose-slate break-words">
              <!-- Render Markdown or raw text. For now, using whitespace-pre-wrap as fallback -->
              <div v-if="msg.content" class="whitespace-pre-wrap">{{ msg.content }}</div>
              <n-spin v-else size="small" stroke="#8b5cf6" />
            </div>

            <!-- Tool Call / Interruption / Other messages -->
            <div v-else class="max-w-[80%] bg-indigo-50 border border-indigo-100 text-indigo-800 px-4 py-3 rounded-xl text-sm font-mono shadow-inner">
              <div class="flex items-center gap-2 mb-2 border-b border-indigo-200 pb-2">
                <span class="font-bold">🔧 工具调用:</span>
                <span>{{ msg.messageType }}</span>
              </div>
              <pre class="overflow-x-auto whitespace-pre-wrap">{{ JSON.stringify(msg, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </n-scrollbar>

      <!-- Input Area -->
      <div class="mt-4 shrink-0 flex gap-3 relative">
        <n-input
          v-model:value="inputMessage"
          type="textarea"
          placeholder="给 Raymi 发送消息... (Shift + Enter 换行)"
          :autosize="{ minRows: 1, maxRows: 5 }"
          class="flex-1 !bg-white !border-slate-300 hover:!border-indigo-400 focus:!border-indigo-500 !text-slate-800 rounded-xl"
          @keydown="handleKeydown"
          :disabled="isGenerating"
        />
        <div class="flex items-end">
          <n-button 
            type="primary" 
            color="#4f46e5"
            class="h-10 px-6 rounded-xl font-bold tracking-widest shadow-md shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            :disabled="!inputMessage.trim() || isGenerating"
            :loading="isGenerating"
            @click="handleSend"
          >
            <template #icon><Send class="w-4 h-4" /></template>
            发送
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Basic Markdown Prose Styling fallback */
.prose pre {
  @apply bg-slate-100 p-3 rounded-lg overflow-x-auto border border-slate-200 my-2;
}
.prose code {
  @apply bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-sm;
}
.prose p {
  @apply mb-2 last:mb-0;
}
</style>
