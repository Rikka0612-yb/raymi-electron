import { ref } from 'vue'
import { chatApi, type MessageDTO } from '../api/chat'

export function useChat(agentName: string = 'Raymi0.1', userId: string = 'default_user') {
  const messages = ref<MessageDTO[]>([])
  const isGenerating = ref(false)
  const threadId = ref<string>(crypto.randomUUID())

  const sendMessage = async (content: string) => {
    if (!content.trim() || isGenerating.value) return

    const userMsg: MessageDTO = {
      messageType: 'user',
      content: content.trim(),
    }
    messages.value.push(userMsg)

    const assistantMsgIndex = messages.value.length
    messages.value.push({ messageType: 'assistant', content: '' })

    isGenerating.value = true

    try {
      const stream = chatApi.runChatStream(
        content.trim(),
        agentName,
        threadId.value,
        userId
      )

      for await (const chunk of stream) {
        messages.value[assistantMsgIndex].content += chunk
      }
    } catch (error) {
      console.error('Error in chat stream:', error)
      messages.value[assistantMsgIndex].content += '\n\n**[Error: Failed to get response]**'
    } finally {
      isGenerating.value = false
    }
  }

  const clearChat = () => {
    messages.value = []
    threadId.value = crypto.randomUUID()
  }

  return {
    messages,
    isGenerating,
    sendMessage,
    clearChat,
  }
}
