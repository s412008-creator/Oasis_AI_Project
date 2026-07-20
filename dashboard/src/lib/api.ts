// Base URL for the CrewAI/FastAPI backend. Set NEXT_PUBLIC_API_URL in the
// Cloudflare Pages project's environment variables for production; falls
// back to the local dev server when unset.
export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export interface AgentStreamEvent {
  type: 'agent_switch' | 'agent_log' | 'result' | 'error';
  agent?: string;
  msg?: string;
  report?: string;
}

/**
 * Posts to an agent orchestration endpoint and streams back Server-Sent
 * Events, invoking onEvent for each parsed message. Network failures (e.g.
 * an unreachable/misconfigured backend) are surfaced as a synthetic
 * `error` event instead of throwing, so callers get a single code path
 * for both transport and application errors.
 */
export async function streamAgentEndpoint(
  path: string,
  body: Record<string, unknown>,
  onEvent: (event: AgentStreamEvent) => void
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    onEvent({
      type: 'error',
      msg: `Unable to reach the AI backend at ${API_BASE_URL}. It may be offline or the API URL may be misconfigured. (${
        err instanceof Error ? err.message : String(err)
      })`,
    });
    return;
  }

  if (!response.ok || !response.body) {
    onEvent({
      type: 'error',
      msg: `Backend responded with an unexpected status (${response.status}).`,
    });
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.substring(6);
          if (dataStr.trim() === '[DONE]') {
            done = true;
            break;
          }
          try {
            onEvent(JSON.parse(dataStr));
          } catch {
            console.error('Failed to parse JSON:', dataStr);
          }
        }
      }
    }
  }
}
