export interface BackendStatus {
  status: string
  service: string
  environment: string
  timestamp: string
}

function isBackendStatus(value: unknown): value is BackendStatus {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.status === 'string' &&
    typeof candidate.service === 'string' &&
    typeof candidate.environment === 'string' &&
    typeof candidate.timestamp === 'string' &&
    !Number.isNaN(Date.parse(candidate.timestamp))
  )
}

export async function getBackendStatus(
  signal?: AbortSignal,
): Promise<BackendStatus> {
  const response = await fetch('/api/status', {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(
      `Backend status request failed with HTTP ${response.status}.`,
    )
  }

  const data: unknown = await response.json()

  if (!isBackendStatus(data)) {
    throw new Error('Backend status response was not valid.')
  }

  return data
}
