export interface Session {
  thread_id: string;
  appName: string;
  userId: string;
  values: {
    messages?: MessageDTO[];
  };
}

export interface UserMessage {
  messageType: 'user';
  content: string;
  metadata?: Record<string, any>;
  media?: MediaDTO[];
}

export interface AgentRunRequest {
  appName: string;
  userId?: string;
  threadId: string;
  newMessage: UserMessage;
  streaming?: boolean;
  stateDelta?: Record<string, any>;
}

export interface AgentResumeRequest {
  appName: string;
  userId?: string;
  threadId: string;
  toolFeedbacks?: ToolFeedbackDTO[];
  streaming?: boolean;
}

export interface ToolFeedbackDTO {
  id: string;
  name: string;
  arguments: string;
  result?: 'APPROVED' | 'REJECTED' | 'EDITED';
  description?: string;
}

export interface MessageDTO {
  messageType: 'assistant' | 'user' | 'tool' | 'tool-request' | 'tool-confirm';
  content: string;
  metadata?: Record<string, any>;
}

export interface AssistantMessageDTO extends MessageDTO {
  messageType: 'assistant';
  toolCalls?: ToolCallDTO[];
}

export interface ToolCallDTO {
  id: string;
  type: string;
  name: string;
  arguments: string;
}

export interface ToolRequestMessageDTO extends MessageDTO {
  messageType: 'tool-request';
  toolCalls?: ToolCallDTO[];
}

export interface ToolRequestConfirmMessageDTO extends MessageDTO {
  messageType: 'tool-confirm';
  toolCalls?: ToolCallConfigDTO[];
}

export interface ToolCallConfigDTO {
  id: string;
  type: string;
  name: string;
  arguments: string;
  description?: string;
}

export interface UserMessageDTO extends MessageDTO {
  messageType: 'user';
  media?: MediaDTO[];
}

export interface MediaDTO {
  mimeType: string;
  data: any;
}

export interface ToolResponseMessageDTO extends MessageDTO {
  messageType: 'tool';
  responses?: ToolResponseDTO[];
}

export interface ToolResponseDTO {
  id: string;
  name: string;
  responseData: string;
}

export interface Usage {
  promptTokens?: number;
  generationTokens?: number;
  totalTokens?: number;
}

export interface AgentRunResponse {
  node: string;
  eventType: 'chunk' | 'message' | 'tool_request' | 'interruption' | 'heartbeat';
  agent: string;
  message: MessageDTO | null;
  tokenUsage: Usage | null;
  chunk: string | null;
}

class ChatApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async *runAgentStream(
    appName: string,
    userId: string,
    threadId: string,
    message: UserMessage,
    signal?: AbortSignal
  ): AsyncGenerator<AgentRunResponse, void, unknown> {
    const request: AgentRunRequest = {
      appName,
      userId,
      threadId,
      newMessage: message,
      streaming: true,
    };

    const response = await fetch(`${this.baseUrl}/api/studio/agent/run_sse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to run agent stream: ${response.statusText}`);
    }

    yield* this._processSSEStream(response);
  }

  async *resumeAgentStream(
    appName: string,
    userId: string,
    threadId: string,
    toolFeedbacks: ToolFeedbackDTO[],
    signal?: AbortSignal
  ): AsyncGenerator<AgentRunResponse, void, unknown> {
    const request: AgentResumeRequest = {
      appName,
      userId,
      threadId,
      toolFeedbacks,
      streaming: true,
    };

    const response = await fetch(`${this.baseUrl}/api/studio/agent/resume_sse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to resume agent stream: ${response.statusText}`);
    }

    yield* this._processSSEStream(response);
  }

  private async *_processSSEStream(
    response: Response
  ): AsyncGenerator<AgentRunResponse, void, unknown> {
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
          if (line.trim().startsWith('data:')) {
            const data = line.slice(5).trim();
            if (data && data !== '{}') {
              try {
                const parsed = JSON.parse(data);
                if (parsed.error) {
                  throw new Error(parsed.errorMessage || 'Unknown SSE Error');
                }
                yield parsed as AgentRunResponse;
              } catch (e) {
                // skip parse error
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

export const chatApi = new ChatApiClient('http://localhost:8612'); // Backend is on 8612
