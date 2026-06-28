export interface MessageDTO {
  messageType: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, any>;
}

export interface ChatRequest {
  message: string;
  agentName?: string;
  threadId?: string;
  userId?: string;
}

class ChatApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Lightweight SSE endpoint: each event is plain text chunk.
   * Uses /api/raymi/chat-stream from raymi-studio-starter.
   */
  async *runChatStream(
    message: string,
    agentName: string = 'Raymi0.1',
    threadId: string,
    userId: string,
    signal?: AbortSignal
  ): AsyncGenerator<string, void, unknown> {
    const request: ChatRequest = {
      message,
      agentName,
      threadId,
      userId,
    };

    const response = await fetch(`${this.baseUrl}/api/raymi/chat-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to run chat stream: ${response.statusText}`);
    }

    yield* this._processPlainTextSSE(response);
  }

  private async *_processPlainTextSSE(response: Response): AsyncGenerator<string, void, unknown> {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is not readable');

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data:')) {
            const data = trimmed.slice(5).trim();
            if (data) {
              // Check for error JSON from SSE error frame
              if (data.startsWith('{')) {
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.error) {
                    throw new Error(parsed.message || parsed.errorMessage || 'SSE Error');
                  }
                } catch (e: any) {
                  if (e.message !== 'SSE Error') throw e;
                }
              } else {
                yield data;
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export const chatApi = new ChatApiClient('');
