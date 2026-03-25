import { ref } from 'vue'
import { chatApi, type MessageDTO, type UserMessage, type AgentRunResponse } from '../api/chat'

export function useChat(appName: string, userId: string = 'default_user') {
  const messages = ref<MessageDTO[]>([])
  const isGenerating = ref(false)
  const threadId = ref<string>(crypto.randomUUID())

  const sendMessage = async (content: string) => {
    if (!content.trim() || isGenerating.value) return

    // Add user message to local state
    const userMsg: MessageDTO = {
      messageType: 'user',
      content: content.trim()
    }
    messages.value.push(userMsg)

    isGenerating.value = true

    // Add a placeholder for assistant response
    const currentAssistantMsgIndex = messages.value.length
    messages.value.push({
      messageType: 'assistant',
      content: ''
    })

    try {
      const stream = chatApi.runAgentStream(
        appName,
        userId,
        threadId.value,
        {
          messageType: 'user',
          content: content.trim()
        } as UserMessage
      )

      for await (const response of stream) {
        handleStreamResponse(response, currentAssistantMsgIndex)
      }
    } catch (error) {
      console.error('Error in chat stream:', error)
      messages.value[currentAssistantMsgIndex].content += '\n\n**[Error: Failed to get response]**'
    } finally {
      isGenerating.value = false
    }
  }

  const handleStreamResponse = (response: AgentRunResponse, msgIndex: number) => {
    const targetMessage = messages.value[msgIndex]

    if (response.eventType === 'chunk' && response.chunk) {
      // Append streaming chunk
      targetMessage.content += response.chunk
    } else if (response.eventType === 'message' && response.message) {
      // Stream finished, replace with complete message (fixes duplicate issue)
      targetMessage.content = response.message.content
      if (response.message.metadata) {
        targetMessage.metadata = response.message.metadata
      }
      // If it's a tool request, we might change its type
      if (response.message.messageType) {
        targetMessage.messageType = response.message.messageType
      }
    } else if (response.eventType === 'tool_request' && response.message) {
      // Handle tool call request (can be displayed as a distinct block)
      messages.value.push(response.message)
    } else if (response.eventType === 'interruption' && response.message) {
      // Handle human-in-the-loop interruption
      messages.value.push(response.message)
    }
  }

  const resumeWithFeedback = async (feedbacks: any[]) => {
    isGenerating.value = true
    try {
      const stream = chatApi.resumeAgentStream(
        appName,
        userId,
        threadId.value,
        feedbacks
      )

      const currentAssistantMsgIndex = messages.value.length
      messages.value.push({
        messageType: 'assistant',
        content: ''
      })

      for await (const response of stream) {
        handleStreamResponse(response, currentAssistantMsgIndex)
      }
    } catch (error) {
      console.error('Error resuming chat stream:', error)
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
    resumeWithFeedback,
    clearChat
  }
}
